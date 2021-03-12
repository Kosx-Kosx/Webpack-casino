import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { AnalyticsService } from 'app/analytics/analytics.service';
import { ComplianceService } from 'app/compliance/compliance.service';
import { CoolingPeriodService } from 'app/cooling-period/cooling-period.service';
import {
  getGameErrorStatus,
  GameStatus,
} from 'app/core/game-status.model';
import { HistoryService } from 'app/core/history.service';
import { PlatformService } from 'app/core/platform.service';
import { RouteService } from 'app/core/route.service';
import { SentryService } from 'app/core/sentry/sentry.service';
import { ConversionModalComponent } from 'app/game-shared/conversion-modal/conversion-modal.component';
import { convertGameErrorToNotification } from 'app/game-shared/convert-error-to-notification.function';
import { LAYOUT_CONFIG, LayoutConfig } from 'app/layout/layout.config';
import { LayoutService } from 'app/layout/layout.service';
import { ModalService } from 'app/modal/modal.service';
import { NotificationsQueueService } from 'app/notifications';
import { PanicService } from 'app/panic/panic.service';
import { RealityCheckService } from 'app/reality-check/reality-check.service';
import { UserService } from 'app/user';
import { WelcomeBackService } from 'app/welcome-back/welcome-back.service';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilKeyChanged,
  filter,
  map,
  mapTo,
  pairwise,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { CasinoGameSyncService } from './casino-game-sync.service';
import { CasinoGameConfig, CASINO_GAME_CONFIG } from './casino-game.config';
import { casinoGameQuery, CasinoGameResponse, Game } from './casino-game.graphql';
import { GameRedirectionService } from './game-redirection.service';

@Component({
  selector: 'xc-casino-game',
  templateUrl: './casino-game.component.html',
  styleUrls: ['./casino-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CasinoGameSyncService,
  ],
})

export class CasinoGameComponent implements OnDestroy {
  focusModeIsEnabled: boolean;
  gameLaunchingDone$: Observable<boolean>;
  gameShouldReset$ = new BehaviorSubject<boolean>(false);

  // We are using this object for Reality Check message translation string.
  // Message for mobile RC has to use same term as desktop RC
  realityCheck = {
    time: '(1)',
    betAmount: '(2)',
    winAmount: '(3)',
  };

  systemClock$ = timer(0, 1000).pipe(map(() => Date.now()));
  showSearchButton: boolean;
  showDepositButton: boolean;
  error$ = new Subject<GameStatus>();
  gameData$: Observable<Game | null>;
  /**
   * Game data. Emits only when no errors were thrown while fetching game data.
   */
  game$: Observable<Game>;
  /**
   * Game object clone taken from `game$` observable. Do not use it when using `game$` is possible.
   * This variable exists in order to be used in `CasinoGameGuard`.
   */
  game: Game;
  gameStatus = GameStatus;
  isMobile: boolean;
  isUserLoggedIn$: Observable<boolean>;
  isRedirecting$ = new Subject<boolean>();
  loading = true;
  loginRequired = false;
  horizontalMargin: number;
  verticalMargin: number;
  responsibleGamingLinkEnabled$: Observable<boolean>;
  mobileResponsibleGamingLinkEnabled$: Observable<boolean>;
  gameVendor$: Observable<string>;

  private resizeSubscription: Subscription;
  private subscriptions = new Subscription();
  private showConversionModal$ = new BehaviorSubject<boolean>(true);

  @ViewChild('headerElem', { static: false }) headerElem: ElementRef;
  @ViewChild('wrapperElem', { static: false }) wrapperElem: ElementRef;
  @ViewChild('controlsElem', { static: false }) controlsElem: ElementRef;
  @ViewChild('footerElem', { static: false }) footerElem: ElementRef;
  @ViewChild('gameViewElem', { static: false }) gameViewElem: ElementRef;

  /**
   * Guard for killing of observables after components gets destroyed.
   */
  private stopWatching$ = new Subject();

  constructor(
    private analyticsService: AnalyticsService,
    private gameRedirectionService: GameRedirectionService,
    private historyService: HistoryService,
    private router: Router,
    private layoutService: LayoutService,
    private modalService: ModalService,
    private platform: PlatformService,
    private routeService: RouteService,
    private sentryService: SentryService,
    public coolingPeriodService: CoolingPeriodService,
    public panicService: PanicService,
    public realityCheckService: RealityCheckService,
    public welcomeBackService: WelcomeBackService,
    public casinoGameSyncService: CasinoGameSyncService,
    apollo: Apollo,
    changeDetector: ChangeDetectorRef,
    complianceService: ComplianceService,
    elRef: ElementRef,
    route: ActivatedRoute,
    notifications: NotificationsQueueService,
    userService: UserService,
    @Inject(CASINO_GAME_CONFIG) config: CasinoGameConfig,
    @Inject(LAYOUT_CONFIG) layoutConfig: LayoutConfig,
  ) {
    this.isMobile = !platform.isDesktop(); // Note: redirection logic uses `mobile` property from game object FAPI response instead
    this.isUserLoggedIn$ = userService.isUserLoggedIn;
    this.showSearchButton = layoutConfig.showSearchButton;
    this.showDepositButton = layoutConfig.showDepositButton;
    this.focusModeIsEnabled = layoutConfig.gameFocusModeIsEnabled;

    const gameId$: Observable<string> = route.params.pipe(pluck('id'));

    this.gameData$ = combineLatest([
      gameId$,
      this.isUserLoggedIn$,
      this.gameShouldReset$,
    ])
    .pipe(
      tap(() => {
        elRef.nativeElement.scrollIntoView(false);
        this.loading = true;
        this.loginRequired = false;
        changeDetector.markForCheck();
      }),
      switchMap(([gameId, isUserLoggedIn, gameShouldReset]) => {
        return apollo
          .query<CasinoGameResponse>({
            query: casinoGameQuery,
            variables: {
              slug: gameId,
              returnUrl: platform.prepareAbsoluteUrl(
                historyService.getPreviousUrl(true, ['cashier', 'play', 'deposit'], '/', false),
              ),
            },
            fetchPolicy: 'network-only',
          })
          .pipe(
            catchError((error: any) => {
              if (error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message === 'Player has no permission to play.') {
                return throwError(GameStatus.PERMISSION_DENIED);
              }
              // When vendorProperties are missing it almost always means that game has not been saved in BO
              if (error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].path[1] === 'vendorProperties') {
                this.sentryService.captureException(
                  new Error('Fetching game failed. vendorProperties are missing.'), 'game_vendor_properties',
                );
              } else {
                this.sentryService.captureException(new Error('Request to fetch game details has failed'), 'game-fetch-failed');
              }
              return throwError(GameStatus.INTERNAL_ERROR);
            }),
            switchMap((result: ApolloQueryResult<CasinoGameResponse>) => {
              const errorMessage = getGameErrorStatus(result.data.game, isUserLoggedIn, result.data.game.loginRequired);
              if (errorMessage) {
                if ([null, GameStatus.INTERNAL_ERROR].includes(errorMessage)) {
                  this.sentryService.captureException(new Error(`Game loading failed (${errorMessage}).`), 'game-load-fail');
                }
                return throwError(errorMessage);
              }

              return userService.setLastGame(gameId)
                .pipe(
                  tap(() => {
                    complianceService.setJurisdiction(result.data.game.jurisdiction);
                    changeDetector.markForCheck();

                    if (!gameShouldReset) {
                      this.sendAnalytics(result.data.game, isUserLoggedIn);
                    }
                  }),
                  map(() => result.data.game),
                );
            }),
            catchError((error: GameStatus) => {
              notifications.showByType(convertGameErrorToNotification(error));
              if (error === GameStatus.LOGIN_REQUIRED) {
                this.loginAndPlay();
              } else {
                this.closeGame();
              }
              return of(null);
            }),
          );
      }),
      takeUntil(this.stopWatching$),
      shareReplay(1),
    );

    this.game$ = this.gameData$.pipe(
      // Proceed only when there was no error while fetching game data
      filter((gameProperties) => {
        this.loading = false;
        return !!gameProperties;
      }),
      // Trigger redirection to a mobile URL when necessary
      switchMap((gameProperties) => {
        this.game = gameProperties;
        return this.gameRedirectionService.redirectOrPassThrough(gameProperties);
      }),
      filter(gameProperties => {
        // When `redirectOrPassThrough` returns `null` it means that app will be redirected to a mobile url
        // and game$ observable should not emit because that would init logic dedicated only for non-redirected games
        if (gameProperties === null) {
          this.isRedirecting$.next(true);
        }
        return !!gameProperties;
      }),
      takeUntil(this.stopWatching$),
      shareReplay(1),
    );

    this.gameData$.pipe(
      tap(() => {
        // `webkit-overflow-scrolling:touch;` on iOS hides content overflowing the element,
        // so  we need to turn it off to allow iframe to be expended to fullscreen
        if (this.platform.detectIOS() !== false) {
          this.layoutService.forcedOverflowScroll$.next(false);
        }
      }),
      takeUntil(this.stopWatching$),
    ).subscribe();

    // handle game area resizing either by window resizing or focus mode switch
    this.resizeSubscription = combineLatest([
        this.layoutService.focusModeIsActive$,
        fromEvent(this.platform.window, 'resize').pipe(startWith(null)),
      ])
      .pipe(debounceTime(200))
      .subscribe(([focusMode]) => this.calculateDimensions(focusMode));
    this.subscriptions.add(this.resizeSubscription);

    // Probably there's no better, cross-provider way to recognize when content was rendered inside a game iframe.
    // Rough time is enough. It's used to remove spinner, which shouldn't be present at all times to avoid burning CPU.
    // VC-93 It's also used to show the footer with responsible gaming link, if enabled for current jurisdiction
    // in CasinoGameConfig.responsibleGamingLinkJurisdictions
    // TODO consider listening to `ready` events from APIs in game providers who offer this event.
    this.gameLaunchingDone$ = this.gameData$.pipe(
      delay(10 * 1000),
      mapTo(true),
      take(1),
    );

    this.gameVendor$ = this.gameData$.pipe(
      filter(game => !!game),
      distinctUntilKeyChanged('vendor'),
      map((game) => game.vendor),
      shareReplay(1),
    );

    this.subscriptions.add(
      this.welcomeBackService.showModalOnGameLaunch$.subscribe(),
    );

    this.subscriptions.add(
      this.gameData$.pipe(
        startWith({} as Game),
        filter(game => !!game),
        map((game) => game ? game : {slug: null} as Game),
        distinctUntilKeyChanged('slug'),
        pairwise(),
        tap(([previousGame, currentGame]) => {
          // Sending `null` is required to stop Reality Check. This applies to case when previous game
          // was running and next game was launched via Game Search. `onDestroy` is not triggered in this case.
          if (previousGame && previousGame.slug) {
            this.realityCheckService.setCurrentGame(null);
          }
          this.realityCheckService.setCurrentGame(currentGame);
        }),
      ).subscribe(),
    );

    this.responsibleGamingLinkEnabled$ = combineLatest([
      userService.isUserLoggedIn,
      userService.jurisdiction,
    ])
    .pipe(
      map(([isLoggedIn, jurisdiction]) =>
        isLoggedIn
        && config.responsibleGamingLinkJurisdictions
        && config.responsibleGamingLinkJurisdictions.includes(jurisdiction),
      ),
    );

    // Need to delay showing the link on mobile to avoid temporary styling issues
    this.mobileResponsibleGamingLinkEnabled$ = combineLatest([
      this.responsibleGamingLinkEnabled$,
      this.gameLaunchingDone$,
    ])
    .pipe(
      map(([linkEnabled, gameLoaded]) => !!linkEnabled && !!gameLoaded),
    );

    // Show conversion modal asking logged out players to log in / register.
    // Display it 1 minute after launching the game, then show 1 more after another minute.
    // On mobile we don't use iframes for logged out users - enable modal for desktop only.
    if (config.showConversionModal && !this.isMobile) {
      /**
       * Time (in ms) between loading the game and the first modal
       * and between the 1st and 2nd modal.
       */
      const conversionModalDelayTime = 60 * 1000;
      this.subscriptions.add(
        combineLatest([
          this.isUserLoggedIn$.pipe(
            // Delay is needed to give enough time for component destroyer to unsubscribe and avoid emission
            // in case when logged in user plays a game, then logs out and is redirected to home.
            delay(1000),
          ),
          this.gameLaunchingDone$.pipe(
            filter(v => !!v),
            // Emit 1 minute after launching the game
            delay(conversionModalDelayTime),
          ),
          this.showConversionModal$,
        ]).pipe(
          // Avoid showing up conversion modal when Login/Register modal is already on screen
          withLatestFrom(this.routeService.modalActive$),
          filter(([[isUserLoggedIn], isRoutableModalActive]) => !isUserLoggedIn && !isRoutableModalActive),
          mapTo(true),
          take(2),
        ).subscribe(() => {
          const componentRef = this.modalService.attachComponentModal<ConversionModalComponent>(ConversionModalComponent);
          this.subscriptions.add(
            componentRef.instance.closed.pipe(
              take(1),
            ).subscribe(() => {
              this.modalService.closeModal(componentRef);
              setTimeout(() => this.showConversionModal$.next(true), conversionModalDelayTime);
            }),
          );
        }),
      );
    }
  }

  // Dynamically calculates DOM dimensions of elements other than game frame.
  // This way we don't need to use magic numbers in config and layout doesn't need to be fixed.
  private calculateDimensions(focusModeIsActive = false) {
    const bottomSearchElem: HTMLElement = this.platform.window.document.getElementById('gameSearchBottom');
    const sgaElem: HTMLElement = this.platform.window.document.getElementById('sgaResponsibleLinks');
    const searchElementStyle = bottomSearchElem ? getComputedStyle(bottomSearchElem) : null;
    const sgaElemHeight = this.platform.outerElemHeight(sgaElem);

    this.horizontalMargin = (this.controlsElem ? this.platform.outerElemWidth(this.controlsElem.nativeElement) : 0) +
      (this.wrapperElem ? parseInt(getComputedStyle(this.wrapperElem.nativeElement).paddingLeft, 10) : 0) +
      (this.wrapperElem ? parseInt(getComputedStyle(this.wrapperElem.nativeElement).paddingRight, 10) : 0);

    this.verticalMargin = (this.headerElem ? this.platform.outerElemHeight(this.headerElem.nativeElement) : 0) +
      (this.footerElem ? this.platform.outerElemHeight(this.footerElem.nativeElement) : 0) +
      (searchElementStyle && searchElementStyle.display === 'block' ? parseInt(searchElementStyle.marginTop, 10) : 0) +
      (focusModeIsActive ? parseInt(getComputedStyle(this.gameViewElem.nativeElement).marginTop, 10) : 0) +
      sgaElemHeight;
  }

  private sendAnalytics(gameData: Game, isUserLoggedIn: boolean) {
    const trackedProperties = {
      id: gameData.slug,
      name: gameData.name,
      mode: isUserLoggedIn ? 'PFR' : 'PFF',
    };
    this.analyticsService.send('play_game', trackedProperties);
  }

  closeGame() {
    this.layoutService.setFocusMode(false);
    this.historyService.backUntil(true, ['/play', '/cashier']);
  }

  refetchGame() {
    this.gameShouldReset$.next(true);
  }

  loginAndPlay() {
    this.loading = false;
    this.loginRequired = true;
    this.router.navigate(['', { outlets: { modal: 'login' }}]);
  }

  toggleFocusMode() {
    this.layoutService.toggleFocusMode();
  }

  ngOnDestroy() {
    this.stopWatching$.next();
    this.layoutService.scrollYEnable$.next(true);
    this.subscriptions.unsubscribe();
    this.layoutService.forcedOverflowScroll$.next(null);
    this.realityCheckService.setCurrentGame(null);
    // Note: there is also canDeactivate guard which executes after the above
  }
}
