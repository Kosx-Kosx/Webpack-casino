import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map, catchError, finalize, take, switchMap } from 'rxjs/operators';
import { CasinoConfig } from 'app/core/casino.config';
import { HistoryService } from 'app/core/history.service';
import { PlatformService } from 'app/core/platform.service';
import { SentryService } from 'app/core/sentry/sentry.service';
import { GermanyUserDataModalService } from 'app/germany-jurisdiction/germany-user-data-modal/germany-user-data-modal.service';
import { RealityCheckType } from 'app/reality-check/reality-check.interface';
import { RealityCheckService } from 'app/reality-check/reality-check.service';
import { UserService } from 'app/user';
import { CasinoGameConfig } from './casino-game.config';
import * as i0 from "@angular/core";
import * as i1 from "../germany-jurisdiction/germany-user-data-modal/germany-user-data-modal.service";
import * as i2 from "../core/history.service";
import * as i3 from "@angular/common/http";
import * as i4 from "../core/platform.service";
import * as i5 from "../reality-check/reality-check.service";
import * as i6 from "../core/sentry/sentry.service";
import * as i7 from "../user/user.service";
import * as i8 from "@angular/router";
import * as i9 from "../core/casino.config";
import * as i10 from "./casino-game.config";
var CasinoGameGuard = /** @class */ (function () {
    function CasinoGameGuard(germanyUserDataModalService, historyService, http, platformService, realityCheckService, sentryService, userService, router, casinoConfig, casinoGameConfig) {
        this.germanyUserDataModalService = germanyUserDataModalService;
        this.historyService = historyService;
        this.http = http;
        this.platformService = platformService;
        this.realityCheckService = realityCheckService;
        this.sentryService = sentryService;
        this.userService = userService;
        this.router = router;
        this.casinoConfig = casinoConfig;
        this.casinoGameConfig = casinoGameConfig;
    }
    CasinoGameGuard.prototype.canActivate = function (next, _state) {
        var _this = this;
        return combineLatest([
            this.userService.isUserLoggedIn,
            this.germanyUserDataModalService.condition$,
        ]).pipe(
        // Mobile NOT logged in users coming from a direct link should see game modal
        // instead of immediate redirection to standalone game page / showing fullscreen iframe.
        // This gives users chance to log-in and is good for SEO (XCAF-834).
        // However, logged in user skip the game modal & redirect to the standalone game page,
        // when casinoConfig allows to skip the game modal.
        map(function (_a) {
            var loggedIn = _a[0], willGermanyUserDataModalShow = _a[1];
            var skipSelectedGameModal = 
            // "Selected game" modal can be disabled by config
            !_this.casinoConfig.showMobileSelectedGameModal
                // Desktop users are always skipping "Selected game" modal
                || _this.platformService.isDesktop()
                // Mobile users are always skipping "Selected game" modal when game details are displayed on thumbnail
                || (!_this.platformService.isDesktop() && _this.casinoConfig.showMobileSelectedGameModal === 'thumbCover')
                // "Selected game" modal may be required only for logged-out users
                || (loggedIn && _this.casinoConfig.showMobileSelectedGameModal === 'loggedout')
                // "Selected game" modal is already being displayed
                || (_this.historyService.current && _this.historyService.current.includes("modal:play/" + next.params['id']))
                // When users choose Login&Play button, game modal should not be shown after logging
                || (loggedIn && _this.historyService.current && _this.historyService.current.includes(':login'))
                // If user got back from full page redirect after deposit, we need to let the game load in the background
                // as we show transaction result (this needs to be in sync with however redirection works in static/payment.html)
                || _this.platformService.location.href.includes('/cashier/deposit/');
            return [
                skipSelectedGameModal,
                willGermanyUserDataModalShow,
            ];
        }), map(function (_a) {
            var skipSelectedGameModal = _a[0], willGermanyUserDataModalShow = _a[1];
            // GT-400 mobile users who need to fill in "German Data" modal must not be redirected to external URL of a mobile non-iframed game
            // because they would be able to play for real without filling in the required modal data
            var gameVendor = next.params.id ? next.params.id.split('-')[0] : null;
            if (willGermanyUserDataModalShow
                && !Object.keys(_this.casinoGameConfig.mobileIframeVendors).includes(gameVendor)
                && !_this.platformService.isDesktop()) {
                // Redirect main outlet from game to lobby. The "German modal" has already been queued and will show with lobby in the background.
                return _this.router.createUrlTree(['casino']);
            }
            // Game page can be launched. Its logic can optionally redirect to an external game URL.
            else if (skipSelectedGameModal) {
                return true;
            }
            // Show "Selected game modal" and lobby in background
            else {
                // `router.createUrlTree` can't be used here due to Angular bug - it's not possible to change primary and outlet at the same time.
                _this.router.navigate([{ outlets: { primary: 'casino', modal: "play/" + next.params['id'] } }]);
                return false;
            }
        }));
    };
    CasinoGameGuard.prototype.canDeactivate = function (component) {
        return this.notifyGameExit$(component.game);
    };
    /**
     * This forces to close backend game session in order to more precisely track the playtime duration.
     * @see GT-137
     */
    CasinoGameGuard.prototype.notifyGameExit$ = function (game) {
        var _this = this;
        // Game is empty eg. when FAPI returns incorrect game data during component initialization
        if (!game) {
            return of(true);
        }
        this.sentryService.addBreadcrumb({
            category: 'Game',
            message: "Exiting game started. Slug: " + game.vendor + "-" + game.slug + "."
                + (this.realityCheckService.currentGameSession ? " Game session ID: " + this.realityCheckService.currentGameSession + "." : ''),
        });
        var notificationSent$ = this.realityCheckService.rcType$.pipe(switchMap(function (rcType) {
            return (rcType === RealityCheckType.FIRST_BET_BASED)
                // Sending confirmation is necessary for DESH users only
                ? _this.http.post('{{apiEndpoint}}/game-exit', {}).pipe(map(function (response) { return response.success; }), catchError(function (error) {
                    // Error should be shown in console, however observable should not throw.
                    // Otherwise the outer observable would throw and complete, while we expect it to continue.
                    console.error("Sending request to /game-exit has failed", error);
                    return of(false);
                }))
                // `success:null` means that sending request was not necessary
                : of(null);
        }), map(function (savedSuccessfully) {
            if (savedSuccessfully) {
                _this.sentryService.addBreadcrumb({
                    category: 'Game',
                    message: "Request to /game-exit returned success:true. Slug: " + game.vendor + "-" + game.slug + "."
                        + (_this.realityCheckService.currentGameSession ? " Game session ID: " + _this.realityCheckService.currentGameSession + "." : ''),
                });
                // Save message in Sentry order to help in analyzing compliance issues
                // when BE logs are not not enough to explain why RC has not been shown to a specific user.
                _this.sentryService.captureMessage('Game session was successfully closed when game ended.', 'game-exit');
            }
            else if (savedSuccessfully === false) {
                _this.sentryService.addBreadcrumb({
                    category: 'Game',
                    message: "Request to /game-exit has failed. Slug: " + game.vendor + "-" + game.slug + "."
                        + (_this.realityCheckService.currentGameSession ? " Game session ID: " + _this.realityCheckService.currentGameSession + "." : ''),
                });
                _this.sentryService.captureException("Request to /game-exit has failed.", 'game-exit');
            }
            // Also for non-DESH sessions (savedSuccessfully === null) we need to always return `true`
            // in order to allow deactivation of the controller.
            return true;
        }), catchError(function (error) {
            _this.sentryService.captureException(new Error(error));
            // We need to return `true` instead of an error in order to complete observable without throwing an error.
            // Throwing error here would stop deactivation of the controller - user would got stuck on game page.
            return of(true);
        }), finalize(function () {
            _this.sentryService.addBreadcrumb({
                category: 'Game',
                message: "Exiting game ends. Slug: " + game.vendor + "-" + game.slug + "."
                    + (_this.realityCheckService.currentGameSession ? " Game session ID: " + _this.realityCheckService.currentGameSession + "." : ''),
            });
            // Session clearing is initiated here instead of inside realityCheckService
            // in order to be able to include the session ID in breadcrumbs above.
            _this.realityCheckService.setCurrentGameSession(null);
        }), 
        // To make sure that observable completes, which is necessary to pass the guard
        take(1));
        return notificationSent$;
    };
    CasinoGameGuard.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CasinoGameGuard_Factory() { return new CasinoGameGuard(i0.ɵɵinject(i1.GermanyUserDataModalService), i0.ɵɵinject(i2.HistoryService), i0.ɵɵinject(i3.HttpClient), i0.ɵɵinject(i4.PlatformService), i0.ɵɵinject(i5.RealityCheckService), i0.ɵɵinject(i6.SentryService), i0.ɵɵinject(i7.UserService), i0.ɵɵinject(i8.Router), i0.ɵɵinject(i9.CASINO_CONFIG), i0.ɵɵinject(i10.CASINO_GAME_CONFIG)); }, token: CasinoGameGuard, providedIn: "root" });
    return CasinoGameGuard;
}());
export { CasinoGameGuard };
