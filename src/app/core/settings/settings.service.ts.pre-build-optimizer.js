var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { HttpClient } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { throwError } from 'rxjs';
import { map, shareReplay, switchMap, catchError, pluck } from 'rxjs/operators';
import { LocationService } from 'app/core/location';
import { SentryService } from 'app/core/sentry/sentry.service';
import { footerQuery } from './footer.graphql';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
import * as i2 from "@angular/common/http";
import * as i3 from "../location/location.service";
import * as i4 from "@angular/platform-browser";
import * as i5 from "../sentry/sentry.service";
var SettingsService = /** @class */ (function () {
    function SettingsService(apollo, http, locationService, sanitizer, sentryService) {
        var _this = this;
        this.apollo = apollo;
        this.http = http;
        this.locationService = locationService;
        this.sanitizer = sanitizer;
        this.sentryService = sentryService;
        this.contentSettings$ = this.http.get('{{apiEndpoint}}/settings/content')
            .pipe(shareReplay(1));
        this.systemSettings$ = this.http.get('{{apiEndpoint}}/settings/system')
            .pipe(shareReplay(1), catchError(function (error) {
            _this.sentryService.captureException("Request to /settings/system has failed.", "system-settings-xhr");
            return throwError(error);
        }));
        /**
         * FAPI returns error when there's no matching footer for current country-language pair.
         * Clients are responsible for ensuring pairs for all possible variants in brands using dynamic footer.
         */
        this.footerSettings$ = this.locationService.location$
            .pipe(
        // Using GET to make request cacheable
        switchMap(function (loc) { return _this.apollo.use('get')
            .query({
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
            .pipe(map(function (_a) {
            var data = _a.data;
            return data.footers.footers[0];
        }), map(function (data) {
            return __assign({}, data, { content: _this.sanitizer.sanitize(SecurityContext.HTML, data.content) });
        }), shareReplay(1)); }));
    }
    SettingsService.prototype.getContentSetting = function (key) {
        return this.contentSettings$.pipe(pluck(key));
    };
    SettingsService.prototype.getFooterSetting = function (key) {
        return this.footerSettings$.pipe(pluck(key));
    };
    SettingsService.prototype.getSystemSetting = function (key) {
        return this.systemSettings$.pipe(pluck(key));
    };
    SettingsService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SettingsService_Factory() { return new SettingsService(i0.ɵɵinject(i1.Apollo), i0.ɵɵinject(i2.HttpClient), i0.ɵɵinject(i3.LocationService), i0.ɵɵinject(i4.DomSanitizer), i0.ɵɵinject(i5.SentryService)); }, token: SettingsService, providedIn: "root" });
    return SettingsService;
}());
export { SettingsService };
