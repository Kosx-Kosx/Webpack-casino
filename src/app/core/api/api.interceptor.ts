import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../app.config';
import { Device } from '../device.type';
import { ENVIRONMENT, EnvConfig } from '../environment.config';
import { PlatformService } from '../platform.service';
import { SessionService } from '../session';

declare global {
  interface Window {
    CF_Access_Client_ID: string;
    CF_Access_Client_Secret: string;
  }
}

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
  private device: Device;

  constructor(
    private platform: PlatformService,
    private sessionService: SessionService,
    @Inject(ENVIRONMENT) private env: EnvConfig,
    @Inject(APP_CONFIG) private config: AppConfig,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.device = platform.getDevice();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Bail out early if it's not a request to our API
    const url = req.url;
    if (url.indexOf('{{apiEndpoint}}') !== 0) {
      return next.handle(req);
    }

    // Decorate our requests with locale and brand
    req = req.clone({
      url: url.replace('{{apiEndpoint}}', this.env.apiEndpoint),
      setParams: {
        locale: this.locale,
        brand: `${this.config.brand}.${this.device}`,
      },
    });

    // Deployment process on staging injects values of these Access Service Tokens
    // in order to authenticate calls to STG FAPI. Access to prod FAPI is not secured.
    if (this.platform.window.CF_Access_Client_ID
      && this.platform.window.CF_Access_Client_ID !== '#CF_Access_Client_ID#'
      && this.platform.window.CF_Access_Client_Secret
      && this.platform.window.CF_Access_Client_Secret !== '#CF_Access_Client_Secret#'
    ) {
      req = req.clone({
        setHeaders: {
          'CF-Access-Client-ID': this.platform.window.CF_Access_Client_ID,
          'CF-Access-Client-Secret': this.platform.window.CF_Access_Client_Secret,
        },
      });
    }

    // OAuth calls don't need authorization
    if (url === '{{apiEndpoint}}/oauth') {
      return next.handle(req);
    }

    // Decorate our requests with authorization header if we have a token
    return this.sessionService.token$
      .pipe(
        first(),
        switchMap(token => {
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token.access_token}`,
              },
            });
          }

          return next
            .handle(req)
            .pipe(
              catchError((response: HttpErrorResponse) => {
                // If user has a session and gets a 401/403 response, revoke token
                // This can happen when calling GET /balances for instance
                // XCAF-775 Don't revoke failed revokes, due to an infinite loop
                if ([401, 403].includes(response.status) && !url.startsWith('{{apiEndpoint}}/oauth-revoke')) {
                  const reason = response.error ? response.error.detail : 'unknown';
                  return this.sessionService.revoke(reason)
                    .pipe(
                      switchMap(() => throwError(response)),
                    );
                }
                return throwError(response);
              }),
            );
        }),
      );
  }
}
