import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Angulartics2 } from 'angulartics2';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { finalize } from 'rxjs/operators';

import { BonusService } from 'app/core/bonus.service';
import { NotificationEnumType, NotificationsQueueService } from 'app/notifications';

import { BONUSES_CONFIG, BonusesConfig } from '../bonuses.config';

@Component({
  selector: 'xc-voucher-claim-form',
  templateUrl: './voucher-claim-form.component.html',
  styleUrls: ['./voucher-claim-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoucherClaimFormComponent implements OnInit, OnDestroy {

  submitted = false;
  thinking = false;
  claimed = false;
  form: FormGroup;

  constructor(
    @Inject(BONUSES_CONFIG) public config: BonusesConfig,
    private angulartics: Angulartics2,
    private bonusService: BonusService,
    private changeDetector: ChangeDetectorRef,
    private notifications: NotificationsQueueService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {}

  private createForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required),
    });
    this.form.valueChanges.subscribe(() => {
      this.submitted = false;
      if (this.form.controls['code'].errors) {
        delete this.form.controls['code'].errors.incorrect;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.thinking = true;
      this.bonusService.claimVoucher(this.form.controls['code'].value)
        .pipe(
          finalize(() => {
            this.thinking = false;
            this.changeDetector.markForCheck();
          }),
          untilDestroyed(this),
        )
        .subscribe(() => {
          this.notifications.showByType(NotificationEnumType.BONUS_VOUCHER_CODE_CLAIMED);
          this.angulartics.eventTrack.next({ action: 'voucher_claim_completed' });
        },
        () => {
          this.form.controls['code'].setErrors({incorrect: true});
          this.angulartics.eventTrack.next({ action: 'voucher_claim_failed' });
        });
    }
  }
}
