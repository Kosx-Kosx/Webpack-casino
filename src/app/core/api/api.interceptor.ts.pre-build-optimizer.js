import { throwError } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { EnvConfig } from '../environment.config';
import { PlatformService } from '../platform.service';
import { SessionService } from '../session';
import * as i0 from "@angular/core";
import * as i1 from "../platform.service";
import * as i2 from "../session/session.service";
import * as i3 from "../environment.config";
import * as i4 from "../app.config";
var ApiInterceptor = /** @class */ (function () {
    function ApiInterceptor(platform, sessionService, env, config, locale) {
        this.platform = platform;
        this.sessionService = sessionService;
        this.env = env;
        this.config = config;
        this.locale = locale;
        this.device = platform.getDevice();
    }
    ApiInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        // Bail out early if it's not a request to our API
        var url = req.url;
        if (url.indexOf('{{apiEndpoint}}') !== 0) {
            return next.handle(req);
        }
        // Decorate our requests with locale and brand
        req = req.clone({
            url: url.replace('{{apiEndpoint}}', this.env.apiEndpoint),
            setParams: {
                locale: this.locale,
                brand: this.config.brand + "." + this.device,
            },
        });
        // Deployment process on staging injects values of these Access Service Tokens
        // in order to authenticate calls to STG FAPI. Access to prod FAPI is not secured.
        if (this.platform.window.CF_Access_Client_ID
            && this.platform.window.CF_Access_Client_ID !== '#CF_Access_Client_ID#'
            && this.platform.window.CF_Access_Client_Secret
            && this.platform.window.CF_Access_Client_Secret !== '#CF_Access_Client_Secret#') {
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
            .pipe(first(), switchMap(function (token) {
            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: "Bearer " + token.access_token,
                    },
                });
            }
            return next
                .handle(req)
                .pipe(catchError(function (response) {
                // If user has a session and gets a 401/403 response, revoke token
                // This can happen when calling GET /balances for instance
                // XCAF-775 Don't revoke failed revokes, due to an infinite loop
                if ([401, 403].includes(response.status) && !url.startsWith('{{apiEndpoint}}/oauth-revoke')) {
                    var reason = response.error ? response.error.detail : 'unknown';
                    return _this.sessionService.revoke(reason)
                        .pipe(switchMap(function () { return throwError(response); }));
                }
                return throwError(response);
            }));
        }));
    };
    ApiInterceptor.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ApiInterceptor_Factory() { return new ApiInterceptor(i0.ɵɵinject(i1.PlatformService), i0.ɵɵinject(i2.SessionService), i0.ɵɵinject(i3.ENVIRONMENT), i0.ɵɵinject(i4.APP_CONFIG), i0.ɵɵinject(i0.LOCALE_ID)); }, token: ApiInterceptor, providedIn: "root" });
    return ApiInterceptor;
}());
export { ApiInterceptor };
