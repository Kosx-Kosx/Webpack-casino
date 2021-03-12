import { NgModule } from '@angular/core';

import { MediaBoxModule } from 'app/media-box/media-box.module';
import { NotificationsModule } from 'app/notifications';
import { SharedModule } from 'app/shared/shared.module';

import { ActivatePhoneFormComponent } from './activate-phone-form/activate-phone-form.component';
import { ActivatePhoneRoutingModule } from './activate-phone-routing.module';
import { ActivatePhoneComponent } from './activate-phone.component';
import { ChangePhoneFormComponent } from './change-phone-form/change-phone-form.component';

@NgModule({
  imports: [
    SharedModule,
    ActivatePhoneRoutingModule,
    MediaBoxModule,
    NotificationsModule,
  ],
  declarations: [
    ActivatePhoneComponent,
    ActivatePhoneFormComponent,
    ChangePhoneFormComponent,
  ],
  exports: [
    ActivatePhoneComponent,
    ActivatePhoneFormComponent,
    ChangePhoneFormComponent,
  ],
})
export class ActivatePhoneModule { }
