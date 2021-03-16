import { Injectable } from '@angular/core';
import { CacheService as ngxCacheService } from '@ngx-cache/core';
import { PlatformService } from 'app/core/platform.service';
import { Observable, of, fromEvent } from 'rxjs';
import { startWith, filter, map } from 'rxjs/operators';

export const CACHE_PREFIX = `xc-`;

@Injectable({ providedIn: 'root' })
export class CacheService {

  constructor(
    private storage: ngxCacheService,
    private platformService: PlatformService,
  ) { }

  /**
   * Push the item that will be stored.
   * This method is synchronus so it doesn't require subscribing to returned observable.
   *
   * @param {string} key - key that the `value` will be stored in
   * @param {T} value - Any value that will be stored under `key`
   * @return {Observable<boolean>} the storage defer observable
   */
  push<T>(key: string, value: T): Observable<boolean> {
    const id = `${CACHE_PREFIX}${key}`;
    return of(this.storage.set(id, value));
  }

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
  pushUserData<T>(user: { id: string }, key: string, value: T): Observable<boolean> {
    return this.push<T>(this.userDataKey(user, key), value);
  }

  /**
   * Request item that is stored under global scope.
   * Can synchronize with changes caused to local storage by other browser tabs.
   *
   * @param {string} key - key that the `value` is stored in
   * @param {T} defaultValue - value returned in case nothing was set for requested key
   * @param {boolean=false} syncTabs - should local storage send new value on its update in local storage
   * @return {Observable<T>} observable to get the stored item
   */
  request<T>(key: string, defaultValue: T = null, syncTabs: boolean = false): Observable<T | null> {
    const id = `${CACHE_PREFIX}${key}`;
    const value = this.storage.has(id) ? this.storage.get(id) : defaultValue;
    // TODO: add global configuration enabling/disabling cross tab communication
    if (syncTabs) {
      return fromEvent(this.platformService.window, 'storage').pipe(
        filter((event: StorageEvent) => event.key === id),
        // new value is enveloped in cache related data structure so its better just use result from storage.get
        map(() => this.storage.get(id)),
        startWith(value),
      );
    }
    return of<T>(value);
  }

  /**
   * Request item that is stored under user scope.
   *
   * @param user user for which scope we request data
   * @param {string} key - key that the `value` is stored in
   * @param {T} defaultValue - value returned in case nothing was set for requested key
   * @param {boolean=false} syncTabs - should local storage send new value on its update in local storage
   */
  requestUserData<T>(user: { id: string }, key: string, defaultValue: T = null, syncTabs: boolean = false): Observable<T | null> {
    return this.request(this.userDataKey(user, key), defaultValue, syncTabs);
  }

  /**
   * Clear all stored items
   *
   * @return {Observable} observable to clean the stored items
   */
  clear() {
    return of(this.storage.clear());
  }

  /**
   * Remove a specific value.
   *
   * @param {string} key - key that the `value` is stored in
   * @return {Observable} observable to remove the stored item
   */
  remove(key: string) {
    return of(this.storage.remove(`${CACHE_PREFIX}${key}`));
  }

  /**
   * Remove user related data from under user scope.
   *
   * @param {{ id: string }} user user for which scope we request data removal
   * @param {string} key variable name
   */
  removeUserData(user: { id: string }, key: string) {
    return of(this.storage.remove(`${CACHE_PREFIX}${this.userDataKey(user, key)}`));
  }

  private userDataKey(user: { id: string }, key: string): string {
    return `${key}-${user.id}`;
  }
}
