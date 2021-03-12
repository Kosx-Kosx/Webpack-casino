import { Injectable, Inject, InjectionToken } from '@angular/core';
import BroadcastChannel from 'broadcast-channel';
import { LeaderElectionOptions, LeaderElector } from 'broadcast-channel/leader-election';

export interface ILeaderElection {
  create(channel: BroadcastChannel<any>, options?: LeaderElectionOptions): LeaderElector;
}

export const LEADER_ELECTION = new InjectionToken<ILeaderElection>('broadcast-channel-leader-election');

/**
 * Signals when browser tabs is switched to being master tab for broadcast channel.
 */
@Injectable()
export class LeaderElectorProvider {
  private electors: { [key: string]: LeaderElector } = {};

  constructor(
    @Inject(LEADER_ELECTION) private leaderElection: ILeaderElection,
  ) {
  }

  public get<T>(channel: BroadcastChannel<T>, options?: LeaderElectionOptions): LeaderElector {
    let elector = this.electors[channel.name];

    if (!elector) {
      this.electors[channel.name] = elector = this.leaderElection.create(channel, {
        fallbackInterval: 10000, // this should be at least 2x bigger than responseTime
        responseTime: 3000, // increase to fix issues with race conditions when electing master
        ...options,
      });
    }

    return elector;
  }
}
