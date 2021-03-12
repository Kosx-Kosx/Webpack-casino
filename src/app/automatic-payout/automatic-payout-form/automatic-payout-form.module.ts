import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';

import { AutomaticPayoutDataService } from '../automatic-payout-data.service';

import { AutomaticPayoutFormComponent } from './automatic-payout-form.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AutomaticPayoutFormComponent,
  ],
  exports: [
    AutomaticPayoutFormComponent,
  ],
  providers: [
    AutomaticPayoutDataService,
  ],
})
export class AutomaticPayoutFormModule {
}
