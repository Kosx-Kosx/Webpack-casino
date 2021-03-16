import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { shareReplay, switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from 'app/user/user.service';
import { LanguageService } from './language.service';
import { LocationService } from './location';
import * as i0 from "@angular/core";
import * as i1 from "../user/user.service";
import * as i2 from "./location/location.service";
import * as i3 from "./language.service";
var JurisdictionService = /** @class */ (function () {
    function JurisdictionService(userService, locationService, languageService, localeId) {
        var _this = this;
        this.userService = userService;
        this.locationService = locationService;
        this.languageService = languageService;
        this.localeId = localeId;
        /**
         * @deprecated use JurisdictionService.jurisdiction$
         */
        this.currentJurisdiction = new BehaviorSubject('mga');
        /**
         * Users belong to a primary jurisdiction upon registration, for example: MGA.
         */
        this.jurisdiction$ = this.userService.currentUser
            .pipe(switchMap(function (user) { return !!user && user.jurisdiction
            ? of(user.jurisdiction)
            : _this.locationService.location$.pipe(map(function (l) { return l.jurisdiction; })); }), shareReplay(1));
        /**
         * Logged in user that belongs to SGA jurisdiction
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.isSgaPlayer$ = combineLatest([
            this.userService.isUserLoggedIn,
            this.jurisdiction$,
        ])
            .pipe(map(function (_a) {
            var userLoggedIn = _a[0], jurisdiction = _a[1];
            return userLoggedIn && jurisdiction === 'sga';
        }), distinctUntilChanged(), shareReplay(1));
        /**
         * Logged in user that belongs to DESH jurisdiction
         */
        this.isDeshPlayer$ = combineLatest([
            this.userService.isUserLoggedIn,
            this.jurisdiction$,
        ])
            .pipe(map(function (_a) {
            var userLoggedIn = _a[0], jurisdiction = _a[1];
            return userLoggedIn && jurisdiction === 'desh';
        }), distinctUntilChanged(), shareReplay(1));
        /**
         * Logged in user that belongs to germany jurisdiction
         */
        this.isGermanyPlayer$ = combineLatest([
            this.userService.isUserLoggedIn,
            this.jurisdiction$,
        ]).pipe(map(function (_a) {
            var userLoggedIn = _a[0], jurisdiction = _a[1];
            return userLoggedIn && jurisdiction === 'germany';
        }), distinctUntilChanged(), shareReplay(1));
        /**
         * Logged out user who either connects from a German IP or is using German site locale
         */
        this.isGermanLoggedOutPlayer$ = combineLatest([
            this.userService.isUserLoggedIn,
            this.locationService.location$,
        ]).pipe(map(function (_a) {
            var userLoggedIn = _a[0], userLocation = _a[1];
            return !userLoggedIn
                && (userLocation.country.code.toLowerCase() === 'de' || _this.localeId === 'de');
        }), shareReplay(1));
        /**
         * Either:
         *
         * - logged in user having a German jurisdiction, or
         *
         * - logged out user who either connects from a German IP or is using German site locale
         */
        this.isGermanJurisdiction$ = combineLatest([
            this.isGermanyPlayer$,
            this.isGermanLoggedOutPlayer$,
        ]).pipe(map(function (_a) {
            var isGermanyPlayer = _a[0], isGermanLoggedOutPlayer = _a[1];
            return isGermanyPlayer || isGermanLoggedOutPlayer;
        }), distinctUntilChanged(), shareReplay(1));
        /**
         * Returns true whenever user is under SGA or logged off and locale is Sweden.
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.sgaLinksEnabled$ = combineLatest([
            this.userService.isUserLoggedIn,
            this.isSgaPlayer$,
            this.languageService.locale$,
            this.locationService.location$,
        ]).pipe(map(function (_a) {
            var isLoggedIn = _a[0], isSgaPlayer = _a[1], locale = _a[2], geoLocation = _a[3];
            return (!isLoggedIn && (locale.code === 'sv' || geoLocation.country.code.toLowerCase() === 'se')) || isSgaPlayer;
        }));
        /**
         * Returns true whenever user is: logged in & jurisdiction is not SGA & language is not Swedish
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.isLoggedInNonSga$ = combineLatest([
            this.userService.isUserLoggedIn,
            this.userService.currentUser,
            this.languageService.locale$,
        ]).pipe(map(function (_a) {
            var isLoggedIn = _a[0], user = _a[1], locale = _a[2];
            return isLoggedIn && locale.code !== 'sv' && user.jurisdiction !== 'sga';
        }));
    }
    JurisdictionService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function JurisdictionService_Factory() { return new JurisdictionService(i0.ɵɵinject(i1.UserService), i0.ɵɵinject(i2.LocationService), i0.ɵɵinject(i3.LanguageService), i0.ɵɵinject(i0.LOCALE_ID)); }, token: JurisdictionService, providedIn: "root" });
    return JurisdictionService;
}());
export { JurisdictionService };
