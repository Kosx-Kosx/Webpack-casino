import { Location } from '@angular/common';
import { Injectable, Injector, InjectionToken } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, CanActivate, UrlTree, Data } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, shareReplay, mergeAll } from 'rxjs/operators';

import { PrimaryOutletData } from './primary-outlet-data.interface';

@Injectable({ providedIn: 'root' })
export class RouteService {

  navigation$ = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      shareReplay(1),
    ) as Observable<NavigationEnd>; // https://github.com/ReactiveX/rxjs/pull/2119#issuecomment-309636043

  // TODO: https://github.com/angular/angular/issues/15004
  primaryOutletData$: Observable<PrimaryOutletData> = this.navigation$
    .pipe(
      map(() => this.route),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(r => r.data),
      shareReplay(),
    );

  asideOutletData$: Observable<Data> = this.navigation$
    .pipe(
      map(() => this.route),
      map(route => route.children
        .filter(children => children.outlet === 'aside'),
      ),
      mergeMap(
        outlets => outlets.map(outlet => outlet.data),
      ),
      mergeAll(),
    );

  modalActive$ = this.navigation$
    .pipe(
      map(event => event.url.includes('modal:')),
      distinctUntilChanged(),
      shareReplay(1),
    );

  url$ = this.navigation$
    .pipe(
      map(event => {
        const urlTree = this.router.parseUrl(event.url);

        // Normalise UrlTree by removing aux routes and queryParams
        urlTree.queryParams = {};
        Object.keys(urlTree.root.children).forEach(outlet => {
          if (outlet !== 'primary') {
            delete urlTree.root.children[outlet];
          }
        });

        return this.ngLocation.prepareExternalUrl(this.router.serializeUrl(urlTree).substr(1));
      }),
      distinctUntilChanged(),
    );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private injector: Injector,
    private ngLocation: Location,
  ) { }

  // not good, not good... Waiting for https://github.com/angular/angular/issues/13523
  justGo(...args: Array<Array<string | object>>) {
    this.router.navigate(['/']);
    args.map((arg, index) => {
      setTimeout(() => this.router.navigate(arg), 100 * (index + 1));
    });
  }

  recursivelyGetGuardTokens(route: ActivatedRoute): Array<InjectionToken<CanActivate>> {
    const config = route.routeConfig;
    const canActivate = config && config.canActivate ? config.canActivate : [];
    return route.children
      ? canActivate.concat(route.children.reduce((acc, r) => acc.concat(this.recursivelyGetGuardTokens(r)), []))
      : canActivate;
  }

  getGuardChain(): Observable<boolean | UrlTree> {
    const tokens = this.recursivelyGetGuardTokens(this.route);
    const guards = tokens.map(token => this.injector.get(token));
    const obs = guards.map(guard => {
      const canActivate: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree =
        guard.canActivate(this.route.snapshot, this.router.routerState.snapshot);
      return canActivate instanceof UrlTree || typeof canActivate === 'boolean' ? of(canActivate) : from(canActivate);
    });

    // Make sure it will always emit something - at least null if there are no guards
    return obs.length ? from(obs).pipe(mergeMap(o => o)) : of(null);
  }
}
