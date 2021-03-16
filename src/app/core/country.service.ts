import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';

import { LocationService, ILocation } from 'app/core/location';

import { countriesQuery, QueryResponse } from './country.graphql';
import { Country } from './country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  /**
   * Returns all countries
   */
  countries$: Observable<Country[]> = this.apollo.query<QueryResponse>({ query: countriesQuery })
    .pipe(
      map(({ data }) => data.countries.edges.map(({ node }) => node)),
      map((countries) => countries.sort((a: Country, b: Country) => a.name > b.name ? 1 : -1)),
      shareReplay(1),
    );

  /**
   * Returns all enabled countries
   */
  enabledCountries$: Observable<Country[]> = this.countries$
    .pipe(
      map((countries) => countries.filter(f => f.enabled),
      shareReplay(1),
  ));

  /**
   * Returns the user country based on geolocation or null if geo country is disabled
   */
  geoCountry$: Observable<Country> = this.locationService.location$.pipe(
    switchMap((value: ILocation) => this.getCountry(value.country.code)),
    map((country: Country) => country && country.enabled ? country : null),
    shareReplay(1),
  );

  constructor(
    private apollo: Apollo,
    private locationService: LocationService,
  ) {
  }

  /**
   * Returns the country related to the parameter
   * @param code country's code
   */
  getCountry(code: string): Observable<Country> {
    const searchedCode = code.toUpperCase();
    return this.countries$.pipe(map((countries) => countries.find(item => item.code.toUpperCase() === searchedCode)));
  }
}
