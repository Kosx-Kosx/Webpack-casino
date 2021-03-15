import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotificationsModule } from 'app/notifications';

import { ActivationNotificationComponent } from './activation-notification.component';

@NgModule({
  declarations: [
    ActivationNotificationComponent,
  ],
  imports: [
    CommonModule,
    NotificationsModule,
  ],
  exports: [
    ActivationNotificationComponent,
  ],
})
export class ActivationNotificationModule { }
