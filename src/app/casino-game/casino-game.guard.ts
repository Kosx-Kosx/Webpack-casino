import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate, UrlTree } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, catchError, finalize, take, switchMap } from 'rxjs/operators';

import { CasinoConfig, CASINO_CONFIG } from 'app/core/casino.config';
import { HistoryService } from 'app/core/history.service';
import { PlatformService } from 'app/core/platform.service';
import { SentryService } from 'app/core/sentry/sentry.service';
import { GermanyUserDataModalService } from 'app/germany-jurisdiction/germany-user-data-modal/germany-user-data-modal.service';
import { RealityCheckType } from 'app/reality-check/reality-check.interface';
import { RealityCheckService } from 'app/reality-check/reality-check.service';
import { UserService } from 'app/user';

import { CasinoGameComponent } from './casino-game.component';
import { CasinoGameConfig, CASINO_GAME_CONFIG } from './casino-game.config';
import { Game } from './casino-game.graphql';

@Injectable({ providedIn: 'root' })
export class CasinoGameGuard implements CanActivate, CanDeactivate<CasinoGameComponent> {

  constructor(
    private germanyUserDataModalService: GermanyUserDataModalService,
    private historyService: HistoryService,
    private http: HttpClient,
    private platformService: PlatformService,
    private realityCheckService: RealityCheckService,
    private sentryService: SentryService,
    private userService: UserService,
    private router: Router,
    @Inject(CASINO_CONFIG) public casinoConfig: CasinoConfig,
    @Inject(CASINO_GAME_CONFIG) public casinoGameConfig: CasinoGameConfig,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return combineLatest([
      this.userService.isUserLoggedIn,
      this.germanyUserDataModalService.condition$,
    ]).pipe(
      // Mobile NOT logged in users coming from a direct link should see game modal
      // instead of immediate redirection to standalone game page / showing fullscreen iframe.
      // This gives users chance to log-in and is good for SEO (XCAF-834).
      // However, logged in user skip the game modal & redirect to the standalone game page,
      // when casinoConfig allows to skip the game modal.
      map(([loggedIn, willGermanyUserDataModalShow]) => {
        const skipSelectedGameModal =
          // "Selected game" modal can be disabled by config
          !this.casinoConfig.showMobileSelectedGameModal
          // Desktop users are always skipping "Selected game" modal
          || this.platformService.isDesktop()
          // Mobile users are always skipping "Selected game" modal when game details are displayed on thumbnail
          || (!this.platformService.isDesktop() && this.casinoConfig.showMobileSelectedGameModal === 'thumbCover')
          // "Selected game" modal may be required only for logged-out users
          || (loggedIn && this.casinoConfig.showMobileSelectedGameModal === 'loggedout')
          // "Selected game" modal is already being displayed
          || (this.historyService.current && this.historyService.current.includes(`modal:play/${next.params['id']}`))
          // When users choose Login&Play button, game modal should not be shown after logging
          || (loggedIn && this.historyService.current && this.historyService.current.includes(':login'))
          // If user got back from full page redirect after deposit, we need to let the game load in the background
          // as we show transaction result (this needs to be in sync with however redirection works in static/payment.html)
          || this.platformService.location.href.includes('/cashier/deposit/');
        return [
          skipSelectedGameModal,
          willGermanyUserDataModalShow,
        ];
      }),
      map(([skipSelectedGameModal, willGermanyUserDataModalShow]) => {
        // GT-400 mobile users who need to fill in "German Data" modal must not be redirected to external URL of a mobile non-iframed game
        // because they would be able to play for real without filling in the required modal data
        const gameVendor = next.params.id ? next.params.id.split('-')[0] : null;
        if (
          willGermanyUserDataModalShow
          && !Object.keys(this.casinoGameConfig.mobileIframeVendors).includes(gameVendor)
          && !this.platformService.isDesktop()
        ) {
          // Redirect main outlet from game to lobby. The "German modal" has already been queued and will show with lobby in the background.
          return this.router.createUrlTree(['casino']);
        }

        // Game page can be launched. Its logic can optionally redirect to an external game URL.
        else if (skipSelectedGameModal) {
          return true;
        }

        // Show "Selected game modal" and lobby in background
        else {
          // `router.createUrlTree` can't be used here due to Angular bug - it's not possible to change primary and outlet at the same time.
          this.router.navigate([{ outlets: { primary: 'casino', modal: `play/${next.params['id']}` } }]);
          return false;
        }
      }),
    );
  }

  canDeactivate(component: CasinoGameComponent): Observable<boolean> {
    return this.notifyGameExit$(component.game);
  }

  /**
   * This forces to close backend game session in order to more precisely track the playtime duration.
   * @see GT-137
   */
  notifyGameExit$(game: Game): Observable<boolean> {
    // Game is empty eg. when FAPI returns incorrect game data during component initialization
    if (!game) {
      return of(true);
    }

    this.sentryService.addBreadcrumb({
      category: 'Game',
      message: `Exiting game started. Slug: ${game.vendor}-${game.slug}.`
        + (this.realityCheckService.currentGameSession ? ` Game session ID: ${this.realityCheckService.currentGameSession}.` : ''),
    });

    const notificationSent$: Observable<boolean> = this.realityCheckService.rcType$.pipe(
      switchMap((rcType) => {
        return (rcType === RealityCheckType.FIRST_BET_BASED)
          // Sending confirmation is necessary for DESH users only
          ? this.http.post<{ success: boolean }>('{{apiEndpoint}}/game-exit', {}).pipe(
            map((response) => response.success),
            catchError((error) => {
              // Error should be shown in console, however observable should not throw.
              // Otherwise the outer observable would throw and complete, while we expect it to continue.
              console.error(`Sending request to /game-exit has failed`, error);
              return of(false);
            }),
          )
          // `success:null` means that sending request was not necessary
          : of(null);
      }),
      map((savedSuccessfully) => {
        if (savedSuccessfully) {
          this.sentryService.addBreadcrumb({
            category: 'Game',
            message: `Request to /game-exit returned success:true. Slug: ${game.vendor}-${game.slug}.`
              + (this.realityCheckService.currentGameSession ? ` Game session ID: ${this.realityCheckService.currentGameSession}.` : ''),
          });
          // Save message in Sentry order to help in analyzing compliance issues
          // when BE logs are not not enough to explain why RC has not been shown to a specific user.
          this.sentryService.captureMessage('Game session was successfully closed when game ended.', 'game-exit');
        }
        else if (savedSuccessfully === false) {
          this.sentryService.addBreadcrumb({
            category: 'Game',
            message: `Request to /game-exit has failed. Slug: ${game.vendor}-${game.slug}.`
              + (this.realityCheckService.currentGameSession ? ` Game session ID: ${this.realityCheckService.currentGameSession}.` : ''),
          });
          this.sentryService.captureException(`Request to /game-exit has failed.`, 'game-exit');
        }
        // Also for non-DESH sessions (savedSuccessfully === null) we need to always return `true`
        // in order to allow deactivation of the controller.
        return true;
      }),
      catchError((error) => {
        this.sentryService.captureException(new Error(error));
        // We need to return `true` instead of an error in order to complete observable without throwing an error.
        // Throwing error here would stop deactivation of the controller - user would got stuck on game page.
        return of(true);
      }),
      finalize(() => {
        this.sentryService.addBreadcrumb({
          category: 'Game',
          message: `Exiting game ends. Slug: ${game.vendor}-${game.slug}.`
            + (this.realityCheckService.currentGameSession ? ` Game session ID: ${this.realityCheckService.currentGameSession}.` : ''),
        });
        // Session clearing is initiated here instead of inside realityCheckService
        // in order to be able to include the session ID in breadcrumbs above.
        this.realityCheckService.setCurrentGameSession(null);
      }),
      // To make sure that observable completes, which is necessary to pass the guard
      take(1),
    );

    return notificationSent$;
  }
}
