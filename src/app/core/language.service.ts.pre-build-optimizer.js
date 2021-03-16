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
import { Apollo } from 'apollo-angular';
import { combineLatest, from } from 'rxjs';
import { map, shareReplay, first, switchMap, tap, mapTo, filter } from 'rxjs/operators';
import { LanguageConfig } from './language.config';
import { languageQuery } from './language.graphql';
import { LocationService } from './location';
import { PlatformService } from './platform.service';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
import * as i2 from "./location/location.service";
import * as i3 from "./platform.service";
import * as i4 from "./language.config";
var LanguageService = /** @class */ (function () {
    function LanguageService(apollo, locationService, platform, localeId, config) {
        this.platform = platform;
        var languages$ = apollo
            .use('get')
            .query({ query: languageQuery })
            .pipe(map(function (_a) {
            var data = _a.data;
            return data.languages.edges.map(function (edge) { return edge.node; });
        }));
        this.locales$ = combineLatest([
            languages$,
            locationService.location$,
        ])
            .pipe(map(function (_a) {
            var languages = _a[0], loc = _a[1];
            var restrictedLanguagesForLocation = config.restrictions
                .filter(function (restriction) { return !restriction.allowedCountries.includes(loc.country.code); })
                .map(function (restriction) { return restriction.language; });
            return languages.filter(function (language) { return !restrictedLanguagesForLocation.includes(language.code); });
        }), shareReplay(1));
        this.locale$ = this.locales$
            .pipe(map(function (locales) { return locales.find(function (locale) { return locale.code === localeId; }) || locales[0]; }), shareReplay(1));
    }
    /**
     * Switches locale if the selected one is different than current.
     *
     * @param {string} localeCode a code of desired locale
     * @returns {Observable<boolean>} an observable that always emits true once its side-effect is executed.
     */
    LanguageService.prototype.switchLocale = function (localeCode) {
        var _this = this;
        return this.locale$
            .pipe(first(), filter(function (currentLocale) { return currentLocale.code !== localeCode; }), switchMap(function (currentLocale) {
            return from(_this.platform.unregisterServiceWorkers()).pipe(tap(function () {
                var newPath = _this.platform.location.href.replace("/" + currentLocale.code + "/", "/" + localeCode + "/");
                if (newPath.includes('(aside:menu)')) {
                    newPath = newPath.replace('(aside:menu)', '');
                }
                _this.platform.gotoAbsoluteUrl(newPath);
            }));
        }), mapTo(true));
    };
    /**
     * Gets all available languages, making sure all optional fields are filled.
     *
     * @returns {Language[]} an array of complete data for all available languages.
     */
    LanguageService.prototype.getCompleteLocaleData = function () {
        return combineLatest([
            this.locale$,
            this.locales$,
        ])
            .pipe(first(), map(function (_a) {
            var current = _a[0], all = _a[1];
            return all.map(function (locale) { return (__assign({}, locale, { current: locale.code === current.code })); });
        }));
    };
    LanguageService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(i0.ɵɵinject(i1.Apollo), i0.ɵɵinject(i2.LocationService), i0.ɵɵinject(i3.PlatformService), i0.ɵɵinject(i0.LOCALE_ID), i0.ɵɵinject(i4.LANGUAGE_CONFIG)); }, token: LanguageService, providedIn: "root" });
    return LanguageService;
}());
export { LanguageService };
