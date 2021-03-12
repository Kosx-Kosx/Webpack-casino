import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UserModule } from 'app/user';

import { ActivateMailModalComponent } from './activate-mail-modal/activate-mail.modal.component';
import { ActivateMailRoutingModule } from './activate-mail-routing.module';

@NgModule({
  imports: [
    SharedModule,
    UserModule,
    ActivateMailRoutingModule,
  ],
  declarations: [
    ActivateMailModalComponent,
  ],
  entryComponents: [
    ActivateMailModalComponent,
  ],
})
export class ActivateMailModule { }
