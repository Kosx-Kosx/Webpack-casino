import { Component, ViewChild, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { FeatureStatusService } from 'app/core/feature-status/feature-status.service';
import { RedirectService } from 'app/core/redirect.service';
import { RouteService } from 'app/core/route.service';
import { LAYOUT_CONFIG, LayoutConfig } from 'app/layout/layout.config';
import { ModalComponent } from 'app/modal/modal.component';
import { PaymentMaintenanceAffectedComponent } from 'app/payment-maintenance/payment-maintenance-affected.component';
import { UserService } from 'app/user';

import { ACCOUNT_MENU_CONFIG, AccountMenuConfig } from './account-menu.config';

@Component({
  selector: 'xc-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMenuComponent extends PaymentMaintenanceAffectedComponent implements OnInit {
  loading = false;
  playerLoginPeriod$: Observable<string>;

  @ViewChild(ModalComponent, { static: false }) modal: ModalComponent;

  constructor(
    protected routeService: RouteService,
    protected userService: UserService,
    protected redirectService: RedirectService,
    protected featureStatusService: FeatureStatusService,
    @Inject(ACCOUNT_MENU_CONFIG) public accountMenuConfig: AccountMenuConfig,
    @Inject(LAYOUT_CONFIG) public layoutConfig: LayoutConfig,
  ) {
    super(featureStatusService);
  }

  logout() {
    this.loading = true;
    this.userService.logout()
      .pipe(
        first(),
        finalize(() => this.loading = false),
      )
      .subscribe(() => {
        this.redirectService.setLoginRedirectUrl(null);
        this.routeService.justGo(['/', { outlets: { modal: null } }]);
      });
  }
}
