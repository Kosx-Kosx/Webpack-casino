import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Angulartics2 } from 'angulartics2';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NotificationEnumType, NotificationsQueueService } from 'app/notifications';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'xc-change-phone-form',
  templateUrl: './change-phone-form.component.html',
  styleUrls: ['./change-phone-form.component.scss'],
})
export class ChangePhoneFormComponent implements OnInit, OnDestroy {

  @Input() phone: string;
  @Output() phoneChange = new EventEmitter<string>();

  private subscriptions = new Subscription();

  form: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private angulartics: Angulartics2,
    private fb: FormBuilder,
    private userService: UserService,
    private notifications: NotificationsQueueService,
  ) { }

  ngOnInit() {
    const mobileCode = this.phone.split(' ')[0];
    const mobileNumber = this.phone.split(' ')[1];

    this.form = this.fb.group({
      mobile_code: new FormControl({ value: mobileCode, disabled: true }, Validators.required),
      mobile_number: new FormControl({ value: mobileNumber, disabled: true }, Validators.required),
      new_mobile_code: new FormControl(mobileCode, [
        Validators.required,
        Validators.pattern(this.userService.mobileCodeRegex),
      ]),
      new_mobile_number: ['', [
        Validators.required,
        Validators.pattern(this.userService.phoneRegex),
      ], this.userService.phoneValidator('new_mobile_code', 'new_mobile_number')],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {

      this.loading = true;

      const data = this.form.getRawValue();
      const newPhone = `${data.new_mobile_code} ${data.new_mobile_number}`;

      this.subscriptions.add(this.userService.changePhone(data)
      .pipe(
        tap(() => this.userService.refreshUserInfo()),
      ).subscribe(() => {
        this.notifications.showByType(NotificationEnumType.PHONE_UPDATE_SUCCESS);
        this.angulartics.eventTrack.next({ action: 'change_phone_succeed' });
        this.loading = false;
        this.phoneChange.next(newPhone);
      }, err => {
        const validationErrors = err.validation_messages;
        this.angulartics.eventTrack.next({ action: 'change_phone_failed' });
        this.loading = false;

        if (err.status === 401) {
          this.form.controls['password'].setErrors({ incorrect : true });
        } else if (err.status === 422 && validationErrors.new_mobile_number) {
          const newMobileNumberErrors = validationErrors.new_mobile_number;
          if (newMobileNumberErrors.isSame) {
            // Both mobile numbers are the same
            this.form.controls['new_mobile_number'].setErrors({ same_number : true });
          } else if (newMobileNumberErrors.phoneNumberActive) {
            // One of the mobile numbers is already verified
            this.form.controls['new_mobile_number'].setErrors({ number_verified : true });
          } else if (newMobileNumberErrors.phoneNumberNoMatch) {
            // The format of the new mobile number is not valid
            this.form.controls['new_mobile_number'].setErrors({ format : true });
          }
        }
      }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
