import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';

import { AchievementNotificationsComponent } from './achievement-notifications.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AchievementNotificationsComponent,
  ],
  exports: [
    AchievementNotificationsComponent,
  ],
})
export class AchievementNotificationsModule {}
