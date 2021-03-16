import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { RouteService } from './route.service';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private defaultRedirect = '/';
  private auxiliaryRouteRegex = /^[^:]+$/;
  private history: string[] = [];

  private get primaryHistory() {
    return this.history.filter(f => this.auxiliaryRouteRegex.test(f));
  }

  get current() {
    return this.history[0];
  }

  get previous() {
    return this.history[1] || this.defaultRedirect;
  }

  /**
   * Determines if user has browsing history that doesn't include any of excludedPaths.
   * @param excludePaths paths that will be ignored while checking history steps
   */
  public hasHistory(excludePaths: string[] | null = null) {
    if (excludePaths !== null) {
      return this.history.filter(historyItem => !excludePaths.some(phrase => historyItem.includes(phrase))).length > 1;
    }

    return this.history.length > 1;
  }

  constructor(private routeService: RouteService, private router: Router) {
    this.routeService.navigation$.subscribe((event: NavigationEnd) => this.history.unshift(event.url));
  }

  back() {
    this.router.navigateByUrl(this.previous);
  }

  /**
   * Bare in mind that this won't redirect user nowhere if he doesn't have any browser history.
   */
  backUntil(primaryHistory = false, excludePaths: string[] | null = null, redirect = this.defaultRedirect) {
    const url = this.getPreviousUrl(primaryHistory, excludePaths, redirect);
    this.router.navigateByUrl(url);
  }

  getPreviousUrl(
    primaryHistory = false,
    excludePaths: string[] | null = null,
    redirect = this.defaultRedirect,
    keepParams = true,
  ): string {
    const history = primaryHistory ? this.primaryHistory : this.history;
    if (history[0] === this.current) {
      history.shift();
    }

    const path = excludePaths
      ? history.find(historyItem => !excludePaths.some(phrase => historyItem.includes(phrase))) || redirect
      : history[0];
    return keepParams ? path : path.split('?')[0];
  }
}
