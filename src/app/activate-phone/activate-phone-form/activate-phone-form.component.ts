import { Component, Output, EventEmitter, Input, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AnalyticsService } from 'app/analytics/analytics.service';
import { NotificationEnumType, NotificationsQueueService } from 'app/notifications';
import { UserService } from 'app/user/user.service';
import { Subscription } from 'rxjs';

import { ActivatePhoneConfig, ACTIVATE_PHONE_CONFIG } from '../activate-phone.config';

@Component({
  selector: 'xc-activate-phone-form',
  templateUrl: './activate-phone-form.component.html',
  styleUrls: ['./activate-phone-form.component.scss'],
})
export class ActivatePhoneFormComponent implements OnDestroy {
  @Input() phone: string;
  @Output() activateUser = new EventEmitter<void>();

  private subscriptions = new Subscription();

  form: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private analyticsService: AnalyticsService,
    private fb: FormBuilder,
    private userService: UserService,
    private notifications: NotificationsQueueService,
    @Inject(ACTIVATE_PHONE_CONFIG) public config: ActivatePhoneConfig,
  ) {
    this.form = this.fb.group({
      code: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      const trackedProperties = {
        method: 'phone',
      };

      this.loading = true;
      this.subscriptions.add(this.userService.activateSMS(this.form.value.code, this.phone)
        .subscribe(
          () => {
            this.activateUser.next();
            this.notifications.showByType(NotificationEnumType.GUEST_ACTIVATION_SUCCESS);
            this.analyticsService.send('activation_succeed', trackedProperties);
          },
          () => {
            this.notifications.showByType(NotificationEnumType.ACCOUNT_ACTIVATION_ERROR);
            this.analyticsService.send('activation_failed', trackedProperties);
            this.loading = false;
          },
          () => this.loading = false,
        ),
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
