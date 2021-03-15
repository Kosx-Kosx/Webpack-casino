import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { finalize } from 'rxjs/operators';

import { Bonus } from 'app/core/bonus.model';
import { BonusService } from 'app/core/bonus.service';
import { NotificationEnumType, NotificationsQueueService } from 'app/notifications';

import { BONUSES_CONFIG, BonusesConfig } from '../bonuses.config';

@Component({
  selector: 'xc-active-bonuses',
  templateUrl: './active-bonuses.component.html',
  styleUrls: [ './active-bonuses.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveBonusesComponent {
  @Input() bonuses: Bonus[] = [];
  cancelling = false;

  constructor(
    @Inject(BONUSES_CONFIG) public config: BonusesConfig,
    private angulartics: Angulartics2,
    private bonusService: BonusService,
    private notifications: NotificationsQueueService,
  ) { }

  cancel(bonus: Bonus) {
    this.cancelling = true;
    this.bonusService.cancel(bonus)
      .pipe(finalize(() => this.cancelling = false))
      .subscribe(
        () => {
          this.notifications.showByType(NotificationEnumType.BONUS_REMOVED_SUCCESS);
          this.angulartics.eventTrack.next({ action: 'bonus_cancel_completed' });
        },
        () => {
          this.notifications.showByType(NotificationEnumType.BONUS_REMOVED_ERROR);
          this.angulartics.eventTrack.next({ action: 'bonus_cancel_failed' });
        },
      );
  }
}
