import { Router } from '@angular/router';
import { RouteService } from './route.service';
import * as i0 from "@angular/core";
import * as i1 from "./route.service";
import * as i2 from "@angular/router";
var HistoryService = /** @class */ (function () {
    function HistoryService(routeService, router) {
        var _this = this;
        this.routeService = routeService;
        this.router = router;
        this.defaultRedirect = '/';
        this.auxiliaryRouteRegex = /^[^:]+$/;
        this.history = [];
        this.routeService.navigation$.subscribe(function (event) { return _this.history.unshift(event.url); });
    }
    Object.defineProperty(HistoryService.prototype, "primaryHistory", {
        get: function () {
            var _this = this;
            return this.history.filter(function (f) { return _this.auxiliaryRouteRegex.test(f); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistoryService.prototype, "current", {
        get: function () {
            return this.history[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistoryService.prototype, "previous", {
        get: function () {
            return this.history[1] || this.defaultRedirect;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Determines if user has browsing history that doesn't include any of excludedPaths.
     * @param excludePaths paths that will be ignored while checking history steps
     */
    HistoryService.prototype.hasHistory = function (excludePaths) {
        if (excludePaths === void 0) { excludePaths = null; }
        if (excludePaths !== null) {
            return this.history.filter(function (historyItem) { return !excludePaths.some(function (phrase) { return historyItem.includes(phrase); }); }).length > 1;
        }
        return this.history.length > 1;
    };
    HistoryService.prototype.back = function () {
        this.router.navigateByUrl(this.previous);
    };
    /**
     * Bare in mind that this won't redirect user nowhere if he doesn't have any browser history.
     */
    HistoryService.prototype.backUntil = function (primaryHistory, excludePaths, redirect) {
        if (primaryHistory === void 0) { primaryHistory = false; }
        if (excludePaths === void 0) { excludePaths = null; }
        if (redirect === void 0) { redirect = this.defaultRedirect; }
        var url = this.getPreviousUrl(primaryHistory, excludePaths, redirect);
        this.router.navigateByUrl(url);
    };
    HistoryService.prototype.getPreviousUrl = function (primaryHistory, excludePaths, redirect, keepParams) {
        if (primaryHistory === void 0) { primaryHistory = false; }
        if (excludePaths === void 0) { excludePaths = null; }
        if (redirect === void 0) { redirect = this.defaultRedirect; }
        if (keepParams === void 0) { keepParams = true; }
        var history = primaryHistory ? this.primaryHistory : this.history;
        if (history[0] === this.current) {
            history.shift();
        }
        var path = excludePaths
            ? history.find(function (historyItem) { return !excludePaths.some(function (phrase) { return historyItem.includes(phrase); }); }) || redirect
            : history[0];
        return keepParams ? path : path.split('?')[0];
    };
    HistoryService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function HistoryService_Factory() { return new HistoryService(i0.ɵɵinject(i1.RouteService), i0.ɵɵinject(i2.Router)); }, token: HistoryService, providedIn: "root" });
    return HistoryService;
}());
export { HistoryService };
