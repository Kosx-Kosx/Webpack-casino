
import { NgModule } from '@angular/core';

import { CoolingPeriodModule } from 'app/cooling-period/cooling-period.module';
import { GameSharedModule } from 'app/game-shared/game-shared.module';
import { MediaBoxModule } from 'app/media-box';
import { SharedModule } from 'app/shared/shared.module';

import { BlockComponent } from './block/block.component';
import { CasinoLobbyComponent } from './casino-lobby.component';
import { CategoryComponent } from './category/category.component';
import { LayoutComponent } from './layout/layout.component';
import { LobbyExpandedDetailsComponent } from './lobby-expanded-details/lobby-expanded-details.component';

@NgModule({
  imports: [
    CoolingPeriodModule,
    SharedModule,
    GameSharedModule,
    MediaBoxModule,
  ],
  exports: [
    CasinoLobbyComponent,
    CategoryComponent,
    LayoutComponent,
    BlockComponent,
  ],
  declarations: [
    CasinoLobbyComponent,
    CategoryComponent,
    LayoutComponent,
    BlockComponent,
    LobbyExpandedDetailsComponent,
  ],
})
export class CasinoLobbyModule {}
