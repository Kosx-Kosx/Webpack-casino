import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'app/user';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'xc-activation-notification',
  templateUrl: './activation-notification.component.html',
})
export class ActivationNotificationComponent implements OnDestroy {
  @Input() showActivationLink = true;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
  }

  public goToActivation(): void {
    this.userService.currentUser
      .pipe(
        untilDestroyed(this),
      ).subscribe(({mobile_code, mobile_number}) => {
        this.router.navigate(
          ['', {
            outlets: {
              aside: null,
              modal: ['activate-phone', `+${mobile_code} ${mobile_number}`],
            },
          }],
        );
      });
  }

  ngOnDestroy() {}
}
