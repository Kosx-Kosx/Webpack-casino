import { HttpClient } from '@angular/common/http';
import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, shareReplay, switchMap, catchError, pluck } from 'rxjs/operators';

import { LocationService } from 'app/core/location';
import { SentryService } from 'app/core/sentry/sentry.service';

import { footerQuery, FooterQueryResponse } from './footer.graphql';
import { IContentSettings, IFooterSettings, ISystemSettings } from './settings.interface';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  public contentSettings$ = this.http.get<IContentSettings>('{{apiEndpoint}}/settings/content')
    .pipe(
      shareReplay(1),
    );

  public systemSettings$ = this.http.get<ISystemSettings>('{{apiEndpoint}}/settings/system')
    .pipe(
      shareReplay(1),
      catchError(error => {
        this.sentryService.captureException(
          `Request to /settings/system has failed.`,
          `system-settings-xhr`,
        );
        return throwError(error);
      }),
    );

  /**
   * FAPI returns error when there's no matching footer for current country-language pair.
   * Clients are responsible for ensuring pairs for all possible variants in brands using dynamic footer.
   */
  public footerSettings$: Observable<IFooterSettings> = this.locationService.location$
      .pipe(
        // Using GET to make request cacheable
        switchMap(loc => this.apollo.use('get')
          .query<FooterQueryResponse>({
            query: footerQuery,
            variables: {
              /**
               * FAPI doesn't read this param and detects country on its own,
               * but we include it to prevent CF from returning the same (cached)
               * country-various response for all countries.
               */
              country: loc.country.code,
            },
          })
          .pipe(
            map(({ data }) => data.footers.footers[0]),
            map(data => {
              return { ...data, content: this.sanitizer.sanitize(SecurityContext.HTML, data.content) };
            }),
            shareReplay(1),
          ),
        ),
      );

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private locationService: LocationService,
    private sanitizer: DomSanitizer,
    private sentryService: SentryService,
  ) {
  }

  public getContentSetting(key: string): Observable<any> {
    return this.contentSettings$.pipe(pluck(key));
  }

  public getFooterSetting(key: string): Observable<any> {
    return this.footerSettings$.pipe(pluck(key));
  }

  public getSystemSetting(key: string): Observable<any> {
    return this.systemSettings$.pipe(pluck(key));
  }
}
