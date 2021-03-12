import { Injectable, OnDestroy } from '@angular/core';
import {
  combineLatest,
  EMPTY,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
  timer,
} from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';

import { BroadcastChannelService } from 'app/broadcast-channel';
import { JurisdictionService } from 'app/core/jurisdiction.service';
import { PlatformService } from 'app/core/platform.service';

export interface CasinoGamePingMessage {
  /**
   * Timestamp of game page initialization
   */
  componentInitTimestamp: number;

  /**
   * Unique identifier of tab that sent the message
   */
  publisherId: string;

  /**
   * ID of expected recipient or `null` when message should be considered as a broadcast message.
   *
   * Note: providing this value doesn't mean that only expected target will receive the message.
   */
  targetSubscriberId: string | null;
}

@Injectable()
export class CasinoGameSyncService implements OnDestroy {
  private componentInitTimestamp = Date.now();
  private pingMessageType = `casinoGamePing`;
  private pingBroadcastFrequency = 1000;

  /**
   * Emits when service gets destroyed
   */
  private stopWatching$ = new Subject();

  /**
   * - `false`: player is allowed to play in **one tab** only
   * - `true`:  player is allowed to play in **any number** of tabs
   */
  private areParallelGameSessionsAllowed$: Observable<boolean> = combineLatest([
    // German jurisdiction requirement says: "Simultaneous playing of several virtual slot machine games on one domain is prohibited."
    this.jurisdictionService.isGermanyPlayer$,
    // DESH licence doesn't block multiple parallel sessions, but we must apply this limit
    // because this is required for bet-based reality check to work correctly
    // (RC detects time of starting a game session so we can't start new session until previous game session closes)
    this.jurisdictionService.isDeshPlayer$,
  ]).pipe(
    map(([isDeshPlayer, isGermanyPlayer]) => !isDeshPlayer && !isGermanyPlayer),
    takeUntil(this.stopWatching$),
    shareReplay(1),
  );

  /**
   * Stream of all ping messages (both broadcasts and responses).
   */
  private receivedMessage$ = this.broadcastChannelService.on<CasinoGamePingMessage>(this.pingMessageType).pipe(
    takeUntil(this.stopWatching$),
    shareReplay(1),
  );

  /**
   * Stream of interpreted messages received from other tabs. Emits:
   * - `false`: when game in other tab is currently running was initialized **after** this tab
   * - `true`:  when game in other tab is currently running was initialized **before** this tab
   */
  private isOtherTabOlder$: Observable<boolean> = this.receivedMessage$.pipe(
    map((message) => this.componentInitTimestamp - message.componentInitTimestamp > 0),
    takeUntil(this.stopWatching$),
    shareReplay(1),
  );

  /**
   * - `false` means that this browser tab is either:
   *   * the only tab where game page is active, or
   *   * other tab(s) exist, but game page in them has been initialized after this tab
   *
   * - `true` means there is an other tab where page is currently running and it was initiated before this tab.
   */
  private olderGameSessionExists$: Observable<boolean> = merge(
    // For better UX its good to immediately block current tab, without waiting until buffer fills up
    this.isOtherTabOlder$.pipe(
      filter((isOtherTabOlder) => !!isOtherTabOlder),
    ),
    this.isOtherTabOlder$.pipe(
      // Messages emitted by all other tabs are being buffered and then the array of collected messages (even empty) is emitted.
      // Note: buffering time can't be smaller than `pingBroadcastFrequency`
      // When buffering time is too small then detection mail be failing, especially during initialization
      bufferTime(2000),
      map((otherSessions) => otherSessions.includes(true)),
      // No need to re-emit that older session exists. Here we only need to confirm that no older tab was detected.
      filter((olderSessionExists) => !olderSessionExists),
    ),
  ).pipe(
    throttleTime(100),
    takeUntil(this.stopWatching$),
    shareReplay(1),
  );

  /**
   * - `false`: game cannot be launched, f.e. due to legal restrictions (GT-519).
   * - `true`: all conditions for launching game have been met or there's no such conditions.
   */
  public isPlayingAllowed$: Observable<boolean> = this.areParallelGameSessionsAllowed$.pipe(
    switchMap((areMultipleGameSessionsAllowed) => areMultipleGameSessionsAllowed
      ? of(false)
      : this.olderGameSessionExists$,
    ),
    map((olderSessionExists) => !olderSessionExists),
    distinctUntilChanged(),
    takeUntil(this.stopWatching$),
    shareReplay(1),
  );

  /**
   * Pub-Sub pattern for cross-tabs communication.
   * - Visible tab(s) periodically emit broadcast messages
   * - Hidden tab(s) emit only in response the the broadcast message emitted by visible tab
   *
   * This observable emits:
   * - `null` when message should be a broadcast (target is all other tabs)
   * - ID of expected recipient when the message should be a response to the received broadcast message
   *
   * Note: hidden tabs can't emit periodically because browsers are throttling JavaScript timers
   * of hidden tabs (f.e. Chrome initially wakes timer once per second and later once per minute)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
   */
  private publishSignal$: Observable<string | null> = this.areParallelGameSessionsAllowed$.pipe(
    switchMap((areMultipleGameSessionsAllowed) => areMultipleGameSessionsAllowed
      ? EMPTY
      : fromEvent(this.platformService.document, 'visibilitychange').pipe(
          startWith(this.platformService.document.visibilityState === 'visible'),
          map(() => this.platformService.document.visibilityState === 'visible'),
          switchMap((isTabVisible) => isTabVisible
            // Active tabs should periodically broadcast message to all other tabs
            ? timer(0, this.pingBroadcastFrequency).pipe(map(() => null))
            // Hidden tabs should only respond to broadcasts
            : this.receivedMessage$.pipe(
                filter((message) => message.targetSubscriberId === null),
                map((message) => message.publisherId),
              ),
          ),
        ),
    ),
    takeUntil(this.stopWatching$),
    shareReplay(1),
  );

  constructor(
    private broadcastChannelService: BroadcastChannelService,
    private jurisdictionService: JurisdictionService,
    private platformService: PlatformService,
  ) {
    // Broadcast messages and respond to broadcasts
    this.areParallelGameSessionsAllowed$.pipe(
      switchMap((areMultipleGameSessionsAllowed) => areMultipleGameSessionsAllowed
        ? EMPTY
        : this.publishSignal$.pipe(
            tap((targetSubscriberId) => {
              const broadcastMessage: CasinoGamePingMessage = {
                componentInitTimestamp: this.componentInitTimestamp,
                publisherId: this.platformService.getUniqueTabId(),
                targetSubscriberId,
              };
              this.broadcastChannelService.emit(this.pingMessageType, broadcastMessage);
            }),
            takeUntil(this.stopWatching$),
          ),
      ),
      takeUntil(this.stopWatching$),
      shareReplay(1),
    ).subscribe();
  }

  ngOnDestroy() {
    this.stopWatching$.next();
  }
}
