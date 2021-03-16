import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { shareReplay, switchMap, map, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from 'app/user/user.service';

import { Jurisdiction } from './jurisdiction.type';
import { LanguageService } from './language.service';
import { LocationService } from './location';

@Injectable({ providedIn: 'root' })
export class JurisdictionService {
  /**
   * @deprecated use JurisdictionService.jurisdiction$
   */
  currentJurisdiction = new BehaviorSubject<Jurisdiction>('mga');

  /**
   * Users belong to a primary jurisdiction upon registration, for example: MGA.
   */
  public jurisdiction$: Observable<Jurisdiction> = this.userService.currentUser
    .pipe(
      switchMap(user => !!user && user.jurisdiction
        ? of(user.jurisdiction)
        : this.locationService.location$.pipe(map(l => l.jurisdiction)),
      ),
      shareReplay(1),
    );

  /**
   * Logged in user that belongs to SGA jurisdiction
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public isSgaPlayer$: Observable<boolean> = combineLatest([
      this.userService.isUserLoggedIn,
      this.jurisdiction$,
    ])
    .pipe(
      map(([userLoggedIn, jurisdiction]) => userLoggedIn && jurisdiction === 'sga'),
      distinctUntilChanged(),
      shareReplay(1),
    );

  /**
   * Logged in user that belongs to DESH jurisdiction
   */
  public isDeshPlayer$: Observable<boolean> = combineLatest([
      this.userService.isUserLoggedIn,
      this.jurisdiction$,
    ])
    .pipe(
      map(([userLoggedIn, jurisdiction]) => userLoggedIn && jurisdiction === 'desh'),
      distinctUntilChanged(),
      shareReplay(1),
    );

  /**
   * Logged in user that belongs to germany jurisdiction
   */
  public isGermanyPlayer$: Observable<boolean> = combineLatest([
    this.userService.isUserLoggedIn,
    this.jurisdiction$,
  ]).pipe(
    map(([userLoggedIn, jurisdiction]) => userLoggedIn && jurisdiction === 'germany'),
    distinctUntilChanged(),
    shareReplay(1),
  );

  /**
   * Logged out user who either connects from a German IP or is using German site locale
   */
  public isGermanLoggedOutPlayer$: Observable<boolean> = combineLatest([
    this.userService.isUserLoggedIn,
    this.locationService.location$,
  ]).pipe(
    map(([userLoggedIn, userLocation]) => !userLoggedIn
      && (userLocation.country.code.toLowerCase() === 'de' || this.localeId === 'de')),
    shareReplay(1),
  );

  /**
   * Either:
   *
   * - logged in user having a German jurisdiction, or
   *
   * - logged out user who either connects from a German IP or is using German site locale
   */
  public isGermanJurisdiction$: Observable<boolean> = combineLatest([
    this.isGermanyPlayer$,
    this.isGermanLoggedOutPlayer$,
  ]).pipe(
    map(([isGermanyPlayer, isGermanLoggedOutPlayer]) => isGermanyPlayer || isGermanLoggedOutPlayer),
    distinctUntilChanged(),
    shareReplay(1),
  );

  /**
   * Returns true whenever user is under SGA or logged off and locale is Sweden.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public sgaLinksEnabled$: Observable<boolean> = combineLatest([
    this.userService.isUserLoggedIn,
    this.isSgaPlayer$,
    this.languageService.locale$,
    this.locationService.location$,
  ]).pipe(
    map(([isLoggedIn, isSgaPlayer, locale, geoLocation]) =>
      (!isLoggedIn && (locale.code === 'sv' || geoLocation.country.code.toLowerCase() === 'se')) || isSgaPlayer),
  );

  /**
   * Returns true whenever user is: logged in & jurisdiction is not SGA & language is not Swedish
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public isLoggedInNonSga$: Observable<boolean> = combineLatest([
    this.userService.isUserLoggedIn,
    this.userService.currentUser,
    this.languageService.locale$,
  ]).pipe(
    map(([isLoggedIn, user, locale]) => isLoggedIn && locale.code !== 'sv' && user.jurisdiction !== 'sga'),
  );

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private languageService: LanguageService,
    @Inject(LOCALE_ID) private localeId: string,
  ) {
  }
}
