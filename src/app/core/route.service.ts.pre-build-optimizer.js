import { Location } from '@angular/common';
import { Injector, InjectionToken } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, UrlTree } from '@angular/router';
import { from, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, shareReplay, mergeAll } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
var RouteService = /** @class */ (function () {
    function RouteService(route, router, injector, ngLocation) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.injector = injector;
        this.ngLocation = ngLocation;
        this.navigation$ = this.router.events
            .pipe(filter(function (event) { return event instanceof NavigationEnd; }), shareReplay(1)); // https://github.com/ReactiveX/rxjs/pull/2119#issuecomment-309636043
        // TODO: https://github.com/angular/angular/issues/15004
        this.primaryOutletData$ = this.navigation$
            .pipe(map(function () { return _this.route; }), map(function (route) {
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }), filter(function (route) { return route.outlet === 'primary'; }), mergeMap(function (r) { return r.data; }), shareReplay());
        this.asideOutletData$ = this.navigation$
            .pipe(map(function () { return _this.route; }), map(function (route) { return route.children
            .filter(function (children) { return children.outlet === 'aside'; }); }), mergeMap(function (outlets) { return outlets.map(function (outlet) { return outlet.data; }); }), mergeAll());
        this.modalActive$ = this.navigation$
            .pipe(map(function (event) { return event.url.includes('modal:'); }), distinctUntilChanged(), shareReplay(1));
        this.url$ = this.navigation$
            .pipe(map(function (event) {
            var urlTree = _this.router.parseUrl(event.url);
            // Normalise UrlTree by removing aux routes and queryParams
            urlTree.queryParams = {};
            Object.keys(urlTree.root.children).forEach(function (outlet) {
                if (outlet !== 'primary') {
                    delete urlTree.root.children[outlet];
                }
            });
            return _this.ngLocation.prepareExternalUrl(_this.router.serializeUrl(urlTree).substr(1));
        }), distinctUntilChanged());
    }
    // not good, not good... Waiting for https://github.com/angular/angular/issues/13523
    RouteService.prototype.justGo = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.router.navigate(['/']);
        args.map(function (arg, index) {
            setTimeout(function () { return _this.router.navigate(arg); }, 100 * (index + 1));
        });
    };
    RouteService.prototype.recursivelyGetGuardTokens = function (route) {
        var _this = this;
        var config = route.routeConfig;
        var canActivate = config && config.canActivate ? config.canActivate : [];
        return route.children
            ? canActivate.concat(route.children.reduce(function (acc, r) { return acc.concat(_this.recursivelyGetGuardTokens(r)); }, []))
            : canActivate;
    };
    RouteService.prototype.getGuardChain = function () {
        var _this = this;
        var tokens = this.recursivelyGetGuardTokens(this.route);
        var guards = tokens.map(function (token) { return _this.injector.get(token); });
        var obs = guards.map(function (guard) {
            var canActivate = guard.canActivate(_this.route.snapshot, _this.router.routerState.snapshot);
            return canActivate instanceof UrlTree || typeof canActivate === 'boolean' ? of(canActivate) : from(canActivate);
        });
        // Make sure it will always emit something - at least null if there are no guards
        return obs.length ? from(obs).pipe(mergeMap(function (o) { return o; })) : of(null);
    };
    RouteService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RouteService_Factory() { return new RouteService(i0.ɵɵinject(i1.ActivatedRoute), i0.ɵɵinject(i1.Router), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i2.Location)); }, token: RouteService, providedIn: "root" });
    return RouteService;
}());
export { RouteService };
