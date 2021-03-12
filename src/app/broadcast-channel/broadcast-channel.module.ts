import { NgModule, ModuleWithProviders } from '@angular/core';
import LeaderElection from 'broadcast-channel/leader-election';

import { BroadcastChannelService, BROADCAST_CHANNEL_NAME } from './broadcast-channel.service';
import { LeaderElectorProvider, LEADER_ELECTION } from './leader-elector.provider';
import { SingleTabBroadcastChannelService } from './single-tab-broadcast-channel.service';

/**
 * I LOVE AoT ... NOT.
 * We cannot pass LeaderElection to dependency injection without use of exported factory function.
 * Without AoT its not a problem.
 */
export function electionFactory() {
  return LeaderElection;
}

@NgModule()
export class BroadcastChannelModule {
  static forRoot(useCrossTabCommunication: boolean = true): ModuleWithProviders {
    return {
      ngModule: BroadcastChannelModule,
      providers: useCrossTabCommunication ? [
        BroadcastChannelService,
        LeaderElectorProvider,
        {
          provide: LEADER_ELECTION,
          useFactory: electionFactory,
        },
        {
          provide: BROADCAST_CHANNEL_NAME,
          useValue: 'main',
        },
      ] : [
        {
          provide: BroadcastChannelService,
          useClass: SingleTabBroadcastChannelService, // turns off communication with other tabs
        },
      ],
    };
  }
}
