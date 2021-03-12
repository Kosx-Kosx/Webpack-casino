import { Injectable, Inject, InjectionToken } from '@angular/core';
import { LeaderElector } from 'broadcast-channel/leader-election';
import { Observable, Observer } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';

import { Logger } from 'app/core/logger';

import { BroadcastChannelProvider } from './broadcast-channel.provider';
import { LeaderElectorProvider } from './leader-elector.provider';

export interface IBroadcastChannelService {
  isMaster: boolean;
  onUpgradeToLeader: Promise<void>;
  on<T = any>(type: string): Observable<T>;
  emit<T = any>(type: string, payload: T): void;
  close(): void;
}

export interface IBroadcastChannelMessage<T = any> {
  type: string;
  payload: T;
}

export const BROADCAST_CHANNEL_NAME = new InjectionToken<string>('broadcast-channel-name');

@Injectable({
  providedIn: 'root',
})
export class BroadcastChannelService implements IBroadcastChannelService {
  /** Name of broadcast channel used for communication */
  readonly CHANNEL_NAME = 'main';

  private broadcastChannel = this.broadcastChannelProvider.get<IBroadcastChannelMessage>(this.channelName);

  private connection: { [key: string]: Observable<any> } = {};

  private messages$ = new Observable<IBroadcastChannelMessage>((observer: Observer<IBroadcastChannelMessage>) => {
    const handler = (message: IBroadcastChannelMessage) => {
      observer.next(message);
    };

    this.broadcastChannel.addEventListener('message', handler);

    return () => {
      this.broadcastChannel.removeEventListener('message', handler);
    };
  });

  private leaderElector: LeaderElector = this.leaderElectorProvider.get(this.broadcastChannel);

  /**
   * Signals when opened window/browser tab is elected as leader and
   * can be used to initialize logic that should only run once per all browser tabs.
   */
  public onUpgradeToLeader = this.leaderElector.awaitLeadership();

  public get isMaster() {
    return this.leaderElector.isLeader;
  }

  constructor(
    private broadcastChannelProvider: BroadcastChannelProvider,
    private leaderElectorProvider: LeaderElectorProvider,
    @Inject(BROADCAST_CHANNEL_NAME) private channelName: string,
    private logger: Logger,
  ) {
  }

  /**
   * Create observer that listens to specific types of messages.
   *
   * @param {string} type defines what messages type should be handled by created observer
   */
  public on<T = any>(type: string): Observable<T> {
    if (!this.connection[type]) {
      this.connection[type] = this.messages$.pipe(
        filter((message: IBroadcastChannelMessage<T>) => message.type === type),
        tap(message => this.logger.log('%cBroadcastChannelService:on', 'color: #080', type, message)),
        map(({ payload }: IBroadcastChannelMessage<T>) => payload),
        share(),
      );
    }
    return this.connection[type];
  }

  /**
   * Emits messages to other tabs.
   *
   * @param type choose what message type listener you want to target
   * @param payload additional data related to message
   */
  public emit<T = any>(type: string, payload: T): void {
    this.logger.log('%cBroadcastChannelService:emit', 'color: #0a0', type, payload);
    this.broadcastChannel.postMessage({ type, payload });
  }

  public close(): void {
    this.broadcastChannel.close();
  }
}
