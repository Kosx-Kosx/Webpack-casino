import { Apollo } from 'apollo-angular';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { LocationService } from 'app/core/location';
import { countriesQuery } from './country.graphql';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
import * as i2 from "./location/location.service";
var CountryService = /** @class */ (function () {
    function CountryService(apollo, locationService) {
        var _this = this;
        this.apollo = apollo;
        this.locationService = locationService;
        /**
         * Returns all countries
         */
        this.countries$ = this.apollo.query({ query: countriesQuery })
            .pipe(map(function (_a) {
            var data = _a.data;
            return data.countries.edges.map(function (_a) {
                var node = _a.node;
                return node;
            });
        }), map(function (countries) { return countries.sort(function (a, b) { return a.name > b.name ? 1 : -1; }); }), shareReplay(1));
        /**
         * Returns all enabled countries
         */
        this.enabledCountries$ = this.countries$
            .pipe(map(function (countries) { return countries.filter(function (f) { return f.enabled; }); }, shareReplay(1)));
        /**
         * Returns the user country based on geolocation or null if geo country is disabled
         */
        this.geoCountry$ = this.locationService.location$.pipe(switchMap(function (value) { return _this.getCountry(value.country.code); }), map(function (country) { return country && country.enabled ? country : null; }), shareReplay(1));
    }
    /**
     * Returns the country related to the parameter
     * @param code country's code
     */
    CountryService.prototype.getCountry = function (code) {
        var searchedCode = code.toUpperCase();
        return this.countries$.pipe(map(function (countries) { return countries.find(function (item) { return item.code.toUpperCase() === searchedCode; }); }));
    };
    CountryService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CountryService_Factory() { return new CountryService(i0.ɵɵinject(i1.Apollo), i0.ɵɵinject(i2.LocationService)); }, token: CountryService, providedIn: "root" });
    return CountryService;
}());
export { CountryService };
