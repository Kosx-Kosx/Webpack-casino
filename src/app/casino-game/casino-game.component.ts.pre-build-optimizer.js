import { ChangeDetectorRef, ElementRef, OnDestroy, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AnalyticsService } from 'app/analytics/analytics.service';
import { ComplianceService } from 'app/compliance/compliance.service';
import { CoolingPeriodService } from 'app/cooling-period/cooling-period.service';
import { getGameErrorStatus, GameStatus, } from 'app/core/game-status.model';
import { HistoryService } from 'app/core/history.service';
import { PlatformService } from 'app/core/platform.service';
import { RouteService } from 'app/core/route.service';
import { SentryService } from 'app/core/sentry/sentry.service';
import { ConversionModalComponent } from 'app/game-shared/conversion-modal/conversion-modal.component';
import { convertGameErrorToNotification } from 'app/game-shared/convert-error-to-notification.function';
import { LayoutConfig } from 'app/layout/layout.config';
import { LayoutService } from 'app/layout/layout.service';
import { ModalService } from 'app/modal/modal.service';
import { NotificationsQueueService } from 'app/notifications';
import { PanicService } from 'app/panic/panic.service';
import { RealityCheckService } from 'app/reality-check/reality-check.service';
import { UserService } from 'app/user';
import { WelcomeBackService } from 'app/welcome-back/welcome-back.service';
import { BehaviorSubject, combineLatest, fromEvent, of, Subject, Subscription, throwError, timer, } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilKeyChanged, filter, map, mapTo, pairwise, pluck, shareReplay, startWith, switchMap, take, takeUntil, tap, withLatestFrom, } from 'rxjs/operators';
import { CasinoGameSyncService } from './casino-game-sync.service';
import { CasinoGameConfig } from './casino-game.config';
import { casinoGameQuery } from './casino-game.graphql';
import { GameRedirectionService } from './game-redirection.service';
var CasinoGameComponent = /** @class */ (function () {
    function CasinoGameComponent(analyticsService, gameRedirectionService, historyService, router, layoutService, modalService, platform, routeService, sentryService, coolingPeriodService, panicService, realityCheckService, welcomeBackService, casinoGameSyncService, apollo, changeDetector, complianceService, elRef, route, notifications, userService, config, layoutConfig) {
        var _this = this;
        this.analyticsService = analyticsService;
        this.gameRedirectionService = gameRedirectionService;
        this.historyService = historyService;
        this.router = router;
        this.layoutService = layoutService;
        this.modalService = modalService;
        this.platform = platform;
        this.routeService = routeService;
        this.sentryService = sentryService;
        this.coolingPeriodService = coolingPeriodService;
        this.panicService = panicService;
        this.realityCheckService = realityCheckService;
        this.welcomeBackService = welcomeBackService;
        this.casinoGameSyncService = casinoGameSyncService;
        this.gameShouldReset$ = new BehaviorSubject(false);
        // We are using this object for Reality Check message translation string.
        // Message for mobile RC has to use same term as desktop RC
        this.realityCheck = {
            time: '(1)',
            betAmount: '(2)',
            winAmount: '(3)',
        };
        this.systemClock$ = timer(0, 1000).pipe(map(function () { return Date.now(); }));
        this.error$ = new Subject();
        this.gameStatus = GameStatus;
        this.isRedirecting$ = new Subject();
        this.loading = true;
        this.loginRequired = false;
        this.subscriptions = new Subscription();
        this.showConversionModal$ = new BehaviorSubject(true);
        /**
         * Guard for killing of observables after components gets destroyed.
         */
        this.stopWatching$ = new Subject();
        this.isMobile = !platform.isDesktop(); // Note: redirection logic uses `mobile` property from game object FAPI response instead
        this.isUserLoggedIn$ = userService.isUserLoggedIn;
        this.showSearchButton = layoutConfig.showSearchButton;
        this.showDepositButton = layoutConfig.showDepositButton;
        this.focusModeIsEnabled = layoutConfig.gameFocusModeIsEnabled;
        var gameId$ = route.params.pipe(pluck('id'));
        this.gameData$ = combineLatest([
            gameId$,
            this.isUserLoggedIn$,
            this.gameShouldReset$,
        ])
            .pipe(tap(function () {
            elRef.nativeElement.scrollIntoView(false);
            _this.loading = true;
            _this.loginRequired = false;
            changeDetector.markForCheck();
        }), switchMap(function (_a) {
            var gameId = _a[0], isUserLoggedIn = _a[1], gameShouldReset = _a[2];
            return apollo
                .query({
                query: casinoGameQuery,
                variables: {
                    slug: gameId,
                    returnUrl: platform.prepareAbsoluteUrl(historyService.getPreviousUrl(true, ['cashier', 'play', 'deposit'], '/', false)),
                },
                fetchPolicy: 'network-only',
            })
                .pipe(catchError(function (error) {
                if (error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message === 'Player has no permission to play.') {
                    return throwError(GameStatus.PERMISSION_DENIED);
                }
                // When vendorProperties are missing it almost always means that game has not been saved in BO
                if (error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].path[1] === 'vendorProperties') {
                    _this.sentryService.captureException(new Error('Fetching game failed. vendorProperties are missing.'), 'game_vendor_properties');
                }
                else {
                    _this.sentryService.captureException(new Error('Request to fetch game details has failed'), 'game-fetch-failed');
                }
                return throwError(GameStatus.INTERNAL_ERROR);
            }), switchMap(function (result) {
                var errorMessage = getGameErrorStatus(result.data.game, isUserLoggedIn, result.data.game.loginRequired);
                if (errorMessage) {
                    if ([null, GameStatus.INTERNAL_ERROR].includes(errorMessage)) {
                        _this.sentryService.captureException(new Error("Game loading failed (" + errorMessage + ")."), 'game-load-fail');
                    }
                    return throwError(errorMessage);
                }
                return userService.setLastGame(gameId)
                    .pipe(tap(function () {
                    complianceService.setJurisdiction(result.data.game.jurisdiction);
                    changeDetector.markForCheck();
                    if (!gameShouldReset) {
                        _this.sendAnalytics(result.data.game, isUserLoggedIn);
                    }
                }), map(function () { return result.data.game; }));
            }), catchError(function (error) {
                notifications.showByType(convertGameErrorToNotification(error));
                if (error === GameStatus.LOGIN_REQUIRED) {
                    _this.loginAndPlay();
                }
                else {
                    _this.closeGame();
                }
                return of(null);
            }));
        }), takeUntil(this.stopWatching$), shareReplay(1));
        this.game$ = this.gameData$.pipe(
        // Proceed only when there was no error while fetching game data
        filter(function (gameProperties) {
            _this.loading = false;
            return !!gameProperties;
        }), 
        // Trigger redirection to a mobile URL when necessary
        switchMap(function (gameProperties) {
            _this.game = gameProperties;
            return _this.gameRedirectionService.redirectOrPassThrough(gameProperties);
        }), filter(function (gameProperties) {
            // When `redirectOrPassThrough` returns `null` it means that app will be redirected to a mobile url
            // and game$ observable should not emit because that would init logic dedicated only for non-redirected games
            if (gameProperties === null) {
                _this.isRedirecting$.next(true);
            }
            return !!gameProperties;
        }), takeUntil(this.stopWatching$), shareReplay(1));
        this.gameData$.pipe(tap(function () {
            // `webkit-overflow-scrolling:touch;` on iOS hides content overflowing the element,
            // so  we need to turn it off to allow iframe to be expended to fullscreen
            if (_this.platform.detectIOS() !== false) {
                _this.layoutService.forcedOverflowScroll$.next(false);
            }
        }), takeUntil(this.stopWatching$)).subscribe();
        // handle game area resizing either by window resizing or focus mode switch
        this.resizeSubscription = combineLatest([
            this.layoutService.focusModeIsActive$,
            fromEvent(this.platform.window, 'resize').pipe(startWith(null)),
        ])
            .pipe(debounceTime(200))
            .subscribe(function (_a) {
            var focusMode = _a[0];
            return _this.calculateDimensions(focusMode);
        });
        this.subscriptions.add(this.resizeSubscription);
        // Probably there's no better, cross-provider way to recognize when content was rendered inside a game iframe.
        // Rough time is enough. It's used to remove spinner, which shouldn't be present at all times to avoid burning CPU.
        // VC-93 It's also used to show the footer with responsible gaming link, if enabled for current jurisdiction
        // in CasinoGameConfig.responsibleGamingLinkJurisdictions
        // TODO consider listening to `ready` events from APIs in game providers who offer this event.
        this.gameLaunchingDone$ = this.gameData$.pipe(delay(10 * 1000), mapTo(true), take(1));
        this.gameVendor$ = this.gameData$.pipe(filter(function (game) { return !!game; }), distinctUntilKeyChanged('vendor'), map(function (game) { return game.vendor; }), shareReplay(1));
        this.subscriptions.add(this.welcomeBackService.showModalOnGameLaunch$.subscribe());
        this.subscriptions.add(this.gameData$.pipe(startWith({}), filter(function (game) { return !!game; }), map(function (game) { return game ? game : { slug: null }; }), distinctUntilKeyChanged('slug'), pairwise(), tap(function (_a) {
            var previousGame = _a[0], currentGame = _a[1];
            // Sending `null` is required to stop Reality Check. This applies to case when previous game
            // was running and next game was launched via Game Search. `onDestroy` is not triggered in this case.
            if (previousGame && previousGame.slug) {
                _this.realityCheckService.setCurrentGame(null);
            }
            _this.realityCheckService.setCurrentGame(currentGame);
        })).subscribe());
        this.responsibleGamingLinkEnabled$ = combineLatest([
            userService.isUserLoggedIn,
            userService.jurisdiction,
        ])
            .pipe(map(function (_a) {
            var isLoggedIn = _a[0], jurisdiction = _a[1];
            return isLoggedIn
                && config.responsibleGamingLinkJurisdictions
                && config.responsibleGamingLinkJurisdictions.includes(jurisdiction);
        }));
        // Need to delay showing the link on mobile to avoid temporary styling issues
        this.mobileResponsibleGamingLinkEnabled$ = combineLatest([
            this.responsibleGamingLinkEnabled$,
            this.gameLaunchingDone$,
        ])
            .pipe(map(function (_a) {
            var linkEnabled = _a[0], gameLoaded = _a[1];
            return !!linkEnabled && !!gameLoaded;
        }));
        // Show conversion modal asking logged out players to log in / register.
        // Display it 1 minute after launching the game, then show 1 more after another minute.
        // On mobile we don't use iframes for logged out users - enable modal for desktop only.
        if (config.showConversionModal && !this.isMobile) {
            /**
             * Time (in ms) between loading the game and the first modal
             * and between the 1st and 2nd modal.
             */
            var conversionModalDelayTime_1 = 60 * 1000;
            this.subscriptions.add(combineLatest([
                this.isUserLoggedIn$.pipe(
                // Delay is needed to give enough time for component destroyer to unsubscribe and avoid emission
                // in case when logged in user plays a game, then logs out and is redirected to home.
                delay(1000)),
                this.gameLaunchingDone$.pipe(filter(function (v) { return !!v; }), 
                // Emit 1 minute after launching the game
                delay(conversionModalDelayTime_1)),
                this.showConversionModal$,
            ]).pipe(
            // Avoid showing up conversion modal when Login/Register modal is already on screen
            withLatestFrom(this.routeService.modalActive$), filter(function (_a) {
                var isUserLoggedIn = _a[0][0], isRoutableModalActive = _a[1];
                return !isUserLoggedIn && !isRoutableModalActive;
            }), mapTo(true), take(2)).subscribe(function () {
                var componentRef = _this.modalService.attachComponentModal(ConversionModalComponent);
                _this.subscriptions.add(componentRef.instance.closed.pipe(take(1)).subscribe(function () {
                    _this.modalService.closeModal(componentRef);
                    setTimeout(function () { return _this.showConversionModal$.next(true); }, conversionModalDelayTime_1);
                }));
            }));
        }
    }
    // Dynamically calculates DOM dimensions of elements other than game frame.
    // This way we don't need to use magic numbers in config and layout doesn't need to be fixed.
    CasinoGameComponent.prototype.calculateDimensions = function (focusModeIsActive) {
        if (focusModeIsActive === void 0) { focusModeIsActive = false; }
        var bottomSearchElem = this.platform.window.document.getElementById('gameSearchBottom');
        var sgaElem = this.platform.window.document.getElementById('sgaResponsibleLinks');
        var searchElementStyle = bottomSearchElem ? getComputedStyle(bottomSearchElem) : null;
        var sgaElemHeight = this.platform.outerElemHeight(sgaElem);
        this.horizontalMargin = (this.controlsElem ? this.platform.outerElemWidth(this.controlsElem.nativeElement) : 0) +
            (this.wrapperElem ? parseInt(getComputedStyle(this.wrapperElem.nativeElement).paddingLeft, 10) : 0) +
            (this.wrapperElem ? parseInt(getComputedStyle(this.wrapperElem.nativeElement).paddingRight, 10) : 0);
        this.verticalMargin = (this.headerElem ? this.platform.outerElemHeight(this.headerElem.nativeElement) : 0) +
            (this.footerElem ? this.platform.outerElemHeight(this.footerElem.nativeElement) : 0) +
            (searchElementStyle && searchElementStyle.display === 'block' ? parseInt(searchElementStyle.marginTop, 10) : 0) +
            (focusModeIsActive ? parseInt(getComputedStyle(this.gameViewElem.nativeElement).marginTop, 10) : 0) +
            sgaElemHeight;
    };
    CasinoGameComponent.prototype.sendAnalytics = function (gameData, isUserLoggedIn) {
        var trackedProperties = {
            id: gameData.slug,
            name: gameData.name,
            mode: isUserLoggedIn ? 'PFR' : 'PFF',
        };
        this.analyticsService.send('play_game', trackedProperties);
    };
    CasinoGameComponent.prototype.closeGame = function () {
        this.layoutService.setFocusMode(false);
        this.historyService.backUntil(true, ['/play', '/cashier']);
    };
    CasinoGameComponent.prototype.refetchGame = function () {
        this.gameShouldReset$.next(true);
    };
    CasinoGameComponent.prototype.loginAndPlay = function () {
        this.loading = false;
        this.loginRequired = true;
        this.router.navigate(['', { outlets: { modal: 'login' } }]);
    };
    CasinoGameComponent.prototype.toggleFocusMode = function () {
        this.layoutService.toggleFocusMode();
    };
    CasinoGameComponent.prototype.ngOnDestroy = function () {
        this.stopWatching$.next();
        this.layoutService.scrollYEnable$.next(true);
        this.subscriptions.unsubscribe();
        this.layoutService.forcedOverflowScroll$.next(null);
        this.realityCheckService.setCurrentGame(null);
        // Note: there is also canDeactivate guard which executes after the above
    };
    return CasinoGameComponent;
}());
export { CasinoGameComponent };
