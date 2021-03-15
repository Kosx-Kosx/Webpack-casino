import { NgModule } from '@angular/core';

import { AutomaticPayoutFormModule } from 'app/automatic-payout/automatic-payout-form/automatic-payout-form.module';
import { APP_START } from 'app/core/app-start';
import { SharedModule } from 'app/shared/shared.module';

import { AutomaticPayoutListenerService } from './automatic-payout-listener.service';
import { AutomaticPayoutModalComponent } from './automatic-payout-modal/automatic-payout-modal.component';
import { AutomaticPayoutRoutingModule } from './automatic-payout-routing.module';

export function InitializeAutoPayout(service: AutomaticPayoutListenerService) {
  return () => service.initializePayoutListener();
}

@NgModule({
  imports: [
    SharedModule,
    AutomaticPayoutFormModule,
    AutomaticPayoutRoutingModule,
  ],
  declarations: [
    AutomaticPayoutModalComponent,
  ],
  providers: [
    AutomaticPayoutListenerService,
    {
      provide: APP_START,
      useFactory: InitializeAutoPayout,
      deps: [AutomaticPayoutListenerService],
      multi: true,
    },
  ],
})
export class AutomaticPayoutModule {
}
