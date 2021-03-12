import { NgModule } from '@angular/core';

import { BonusCarouselModule } from 'app/bonus-carousel/bonus-carousel.module';
import { ModalSharedModule } from 'app/modal-shared/modal-shared.module';
import { NotificationsModule } from 'app/notifications';
import { SharedModule } from 'app/shared/shared.module';
import { UserModule } from 'app/user';

import { ActiveBonusesComponent } from './active-bonuses/active-bonuses.component';
import { AvailableBonusesComponent } from './available-bonuses/available-bonuses.component';
import { BonusComponent } from './bonus/bonus.component';
import { BonusesComponent } from './bonuses.component';
import { ClaimedBonusesComponent } from './claimed-bonuses/claimed-bonuses.component';
import { VoucherClaimFormComponent } from './voucher-claim-form/voucher-claim-form.component';

@NgModule({
  imports: [
    SharedModule,
    UserModule,
    ModalSharedModule,
    NotificationsModule,
    BonusCarouselModule,
  ],
  exports: [
    BonusComponent,
    BonusesComponent,
    VoucherClaimFormComponent,
    ActiveBonusesComponent,
    AvailableBonusesComponent,
    ClaimedBonusesComponent,
  ],
  declarations: [
    BonusComponent,
    BonusesComponent,
    VoucherClaimFormComponent,
    ActiveBonusesComponent,
    AvailableBonusesComponent,
    ClaimedBonusesComponent,
  ],
})
export class BonusesModule {}
