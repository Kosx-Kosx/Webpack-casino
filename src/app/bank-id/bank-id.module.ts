import { NgModule, ModuleWithProviders } from '@angular/core';

import { NotificationsModule } from 'app/notifications';
import { SharedModule } from 'app/shared/shared.module';

import { BankIdService } from './bank-id.service';

@NgModule({
  imports: [
    SharedModule,
    NotificationsModule,
  ],
})
export class BankIdModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BankIdModule,
      providers: [ BankIdService ],
    };
  }
}
