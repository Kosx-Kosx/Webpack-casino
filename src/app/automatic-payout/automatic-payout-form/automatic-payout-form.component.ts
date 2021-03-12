import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { Subscription, Observable } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';

import { CurrenciesService } from 'app/core/currencies.service';
import { NotificationsQueueService, NotificationEnumType } from 'app/notifications';

import { AutomaticPayoutDataService } from '../automatic-payout-data.service';

@Component({
  selector: 'xc-automatic-payout-form',
  templateUrl: './automatic-payout-form.component.html',
  styleUrls: ['./automatic-payout-form.component.scss'],
})
export class AutomaticPayoutFormComponent implements OnInit, OnDestroy {

  public initialLoading = true;
  public updateLoading = false;
  public form: FormGroup;
  public maxThreshold: number;

  public currencyMaskOptions$: Observable<Partial<CurrencyMaskConfig>> = this.currenciesService.userCurrency$
  .pipe(
    map((currency) => this.currenciesService.getMask(currency.symbol)),
  );

  private subs = new Subscription();
  private statusCtrl: FormControl;
  private thresholdCtrl: FormControl;
  private lastThreshold: number;

  constructor(
    private service: AutomaticPayoutDataService,
    private fb: FormBuilder,
    private notifications: NotificationsQueueService,
    private currenciesService: CurrenciesService,
  ) {
  }

  ngOnInit() {
    this.subs.add(this.service.getCurrentSettings()
      .subscribe(settings => {
        this.maxThreshold = settings.max_threshold;
        this.form = this.fb.group({
          status: new FormControl(settings.status || false),
          threshold: new FormControl(
            settings.threshold || 0,
            [
              Validators.min(1),
              Validators.max(settings.max_threshold),
              this.thresholdNaNValidator,
            ],
          ),
        });

        this.statusCtrl = this.form.controls['status'] as FormControl;
        this.thresholdCtrl = this.form.controls['threshold'] as FormControl;

        if (!settings.status) {
          this.thresholdCtrl.disable();
        }

        this.lastThreshold = settings.threshold;
        this.initialLoading = false;
      }),
    );

  }

  onCheckboxChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.thresholdCtrl.enable();
    } else {
      if (this.thresholdCtrl.invalid) {
        this.thresholdCtrl.setValue(this.lastThreshold);
        this.thresholdCtrl.setErrors(null);
      }
      this.thresholdCtrl.disable();
    }
  }

  onSubmit() {
    this.updateLoading = true;

    this.subs.add(
      this.service.saveNewSettings(
        this.statusCtrl.value,
        this.thresholdCtrl.value,
      ).pipe(
        first(),
        finalize(() => this.updateLoading = false),
      ).subscribe(
        res => {
          this.lastThreshold = this.thresholdCtrl.value;
          this.notifications.showByType(
            res.stored
              ? NotificationEnumType.AUTOMATIC_PAYOUT_SETTINGS_SUCCESS
              : NotificationEnumType.AUTOMATIC_PAYOUT_SETTINGS_FAILED,
          );
          this.form.markAsPristine();
        },
        () => this.notifications.showByType(NotificationEnumType.AUTOMATIC_PAYOUT_SETTINGS_FAILED),
      ),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /** Since ng2-currency-mask interferes somehow with basic required validator, we need our own. */
  private thresholdNaNValidator(ctrl: FormControl) {
    return isNaN(ctrl.value) ? { required: true } : null;
  }
}
