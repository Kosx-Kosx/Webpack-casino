import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, combineLatest, from } from 'rxjs';
import { map, shareReplay, first, switchMap, tap, mapTo, filter } from 'rxjs/operators';

import { LANGUAGE_CONFIG, LanguageConfig } from './language.config';
import { QueryResponse, languageQuery, Language } from './language.graphql';
import { LocationService } from './location';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  locales$: Observable<Language[]>;

  locale$: Observable<Language>;

  constructor(
    apollo: Apollo,
    locationService: LocationService,
    private platform: PlatformService,
    @Inject(LOCALE_ID) localeId: string,
    @Inject(LANGUAGE_CONFIG) config: LanguageConfig,
  ) {
    const languages$ = apollo
      .use('get')
      .query<QueryResponse>({ query: languageQuery })
      .pipe(
        map(({ data }) => data.languages.edges.map(edge => edge.node)),
      );

    this.locales$ = combineLatest([
      languages$,
      locationService.location$,
    ])
      .pipe(
        map(([languages, loc]) => {
          const restrictedLanguagesForLocation = config.restrictions
            .filter(restriction => !restriction.allowedCountries.includes(loc.country.code))
            .map(restriction => restriction.language);

          return languages.filter(language => !restrictedLanguagesForLocation.includes(language.code));
        }),
        shareReplay(1),
      );

    this.locale$ = this.locales$
      .pipe(
        map(locales => locales.find(locale => locale.code === localeId) || locales[0]),
        shareReplay(1),
      );
  }

  /**
   * Switches locale if the selected one is different than current.
   *
   * @param {string} localeCode a code of desired locale
   * @returns {Observable<boolean>} an observable that always emits true once its side-effect is executed.
   */
  switchLocale(localeCode: string): Observable<boolean> {
    return this.locale$
      .pipe(
        first(),
        filter(currentLocale => currentLocale.code !== localeCode),
        switchMap(currentLocale => {
          return from(this.platform.unregisterServiceWorkers()).pipe(
            tap(() => {
              let newPath = this.platform.location.href.replace(`/${currentLocale.code}/`, `/${localeCode}/`);
              if (newPath.includes('(aside:menu)')) {
                newPath = newPath.replace('(aside:menu)', '');
              }
              this.platform.gotoAbsoluteUrl(newPath);
            }),
          );
        }),
        mapTo(true),
      );
  }

  /**
   * Gets all available languages, making sure all optional fields are filled.
   *
   * @returns {Language[]} an array of complete data for all available languages.
   */
  getCompleteLocaleData(): Observable<Language[]> {
    return combineLatest([
      this.locale$,
      this.locales$,
    ])
    .pipe(
      first(),
      map(([current, all]) => all.map(locale => ({
        ...locale,
        current: locale.code === current.code,
      }))),
    );
  }
}
