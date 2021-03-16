import { CacheService as ngxCacheService } from '@ngx-cache/core';
import { PlatformService } from 'app/core/platform.service';
import { of, fromEvent } from 'rxjs';
import { startWith, filter, map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-cache/core";
import * as i2 from "./platform.service";
export var CACHE_PREFIX = "xc-";
var CacheService = /** @class */ (function () {
    function CacheService(storage, platformService) {
        this.storage = storage;
        this.platformService = platformService;
    }
    /**
     * Push the item that will be stored.
     * This method is synchronus so it doesn't require subscribing to returned observable.
     *
     * @param {string} key - key that the `value` will be stored in
     * @param {T} value - Any value that will be stored under `key`
     * @return {Observable<boolean>} the storage defer observable
     */
    CacheService.prototype.push = function (key, value) {
        var id = "" + CACHE_PREFIX + key;
        return of(this.storage.set(id, value));
    };
    /**
     * Store user related data under user scope so it can be accessed only if we have user id.
     *
     * TODO(future): consider encoding for confidential data
     * TODO: consider using last_login as user session identifier
     *
     * @template T stored data type
     * @param {{ id: string }} user user for which scope we request data
     * @param {string} key variable name
     * @param {T} value data to be stored
     */
    CacheService.prototype.pushUserData = function (user, key, value) {
        return this.push(this.userDataKey(user, key), value);
    };
    /**
     * Request item that is stored under global scope.
     * Can synchronize with changes caused to local storage by other browser tabs.
     *
     * @param {string} key - key that the `value` is stored in
     * @param {T} defaultValue - value returned in case nothing was set for requested key
     * @param {boolean=false} syncTabs - should local storage send new value on its update in local storage
     * @return {Observable<T>} observable to get the stored item
     */
    CacheService.prototype.request = function (key, defaultValue, syncTabs) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = null; }
        if (syncTabs === void 0) { syncTabs = false; }
        var id = "" + CACHE_PREFIX + key;
        var value = this.storage.has(id) ? this.storage.get(id) : defaultValue;
        // TODO: add global configuration enabling/disabling cross tab communication
        if (syncTabs) {
            return fromEvent(this.platformService.window, 'storage').pipe(filter(function (event) { return event.key === id; }), 
            // new value is enveloped in cache related data structure so its better just use result from storage.get
            map(function () { return _this.storage.get(id); }), startWith(value));
        }
        return of(value);
    };
    /**
     * Request item that is stored under user scope.
     *
     * @param user user for which scope we request data
     * @param {string} key - key that the `value` is stored in
     * @param {T} defaultValue - value returned in case nothing was set for requested key
     * @param {boolean=false} syncTabs - should local storage send new value on its update in local storage
     */
    CacheService.prototype.requestUserData = function (user, key, defaultValue, syncTabs) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (syncTabs === void 0) { syncTabs = false; }
        return this.request(this.userDataKey(user, key), defaultValue, syncTabs);
    };
    /**
     * Clear all stored items
     *
     * @return {Observable} observable to clean the stored items
     */
    CacheService.prototype.clear = function () {
        return of(this.storage.clear());
    };
    /**
     * Remove a specific value.
     *
     * @param {string} key - key that the `value` is stored in
     * @return {Observable} observable to remove the stored item
     */
    CacheService.prototype.remove = function (key) {
        return of(this.storage.remove("" + CACHE_PREFIX + key));
    };
    /**
     * Remove user related data from under user scope.
     *
     * @param {{ id: string }} user user for which scope we request data removal
     * @param {string} key variable name
     */
    CacheService.prototype.removeUserData = function (user, key) {
        return of(this.storage.remove("" + CACHE_PREFIX + this.userDataKey(user, key)));
    };
    CacheService.prototype.userDataKey = function (user, key) {
        return key + "-" + user.id;
    };
    CacheService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CacheService_Factory() { return new CacheService(i0.ɵɵinject(i1.CacheService), i0.ɵɵinject(i2.PlatformService)); }, token: CacheService, providedIn: "root" });
    return CacheService;
}());
export { CacheService };
