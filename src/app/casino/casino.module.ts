import { NgModule } from '@angular/core';

import { CasinoLobbyModule } from 'app/casino-lobby/casino-lobby.module';
import { MediaBoxModule } from 'app/media-box';
import { SharedModule } from 'app/shared/shared.module';
import { WinnersScrollerModule } from 'app/winners/winners-scroller/winners-scroller.module';

import { CasinoRoutingModule } from './casino-routing.module';
import { CasinoComponent } from './casino.component';

@NgModule({
  imports: [
    SharedModule,
    MediaBoxModule,
    WinnersScrollerModule,
    CasinoLobbyModule,
    CasinoRoutingModule,
  ],
  declarations: [
    CasinoComponent,
  ],
})
export class CasinoModule { }
