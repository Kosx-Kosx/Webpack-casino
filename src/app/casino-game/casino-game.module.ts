import { NgModule } from '@angular/core';

import { GameRedirectionService } from 'app/casino-game/game-redirection.service';
import { CoolingPeriodModule } from 'app/cooling-period/cooling-period.module';
import { GameSharedModule } from 'app/game-shared/game-shared.module';
import { GameVendorsModule } from 'app/game-vendors/game-vendors.module';
import { PanicModule } from 'app/panic/panic.module';
import { RealityCheckModule } from 'app/reality-check/reality-check.module';
import { SharedModule } from 'app/shared/shared.module';

import { CasinoGameRoutingModule } from './casino-game-routing.module';
import { CasinoGameComponent } from './casino-game.component';

@NgModule({
  imports: [
    CasinoGameRoutingModule,
    CoolingPeriodModule,
    GameVendorsModule,
    GameSharedModule,
    PanicModule,
    RealityCheckModule,
    SharedModule,
  ],
  declarations: [
    CasinoGameComponent,
  ],
  providers: [
    GameRedirectionService,
  ],
})
export class CasinoGameModule { }
