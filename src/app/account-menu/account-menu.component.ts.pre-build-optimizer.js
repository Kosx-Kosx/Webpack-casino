var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { OnInit } from '@angular/core';
import { finalize, first } from 'rxjs/operators';
import { FeatureStatusService } from 'app/core/feature-status/feature-status.service';
import { RedirectService } from 'app/core/redirect.service';
import { RouteService } from 'app/core/route.service';
import { LayoutConfig } from 'app/layout/layout.config';
import { ModalComponent } from 'app/modal/modal.component';
import { PaymentMaintenanceAffectedComponent } from 'app/payment-maintenance/payment-maintenance-affected.component';
import { UserService } from 'app/user';
import { AccountMenuConfig } from './account-menu.config';
var AccountMenuComponent = /** @class */ (function (_super) {
    __extends(AccountMenuComponent, _super);
    function AccountMenuComponent(routeService, userService, redirectService, featureStatusService, accountMenuConfig, layoutConfig) {
        var _this = _super.call(this, featureStatusService) || this;
        _this.routeService = routeService;
        _this.userService = userService;
        _this.redirectService = redirectService;
        _this.featureStatusService = featureStatusService;
        _this.accountMenuConfig = accountMenuConfig;
        _this.layoutConfig = layoutConfig;
        _this.loading = false;
        return _this;
    }
    AccountMenuComponent.prototype.logout = function () {
        var _this = this;
        this.loading = true;
        this.userService.logout()
            .pipe(first(), finalize(function () { return _this.loading = false; }))
            .subscribe(function () {
            _this.redirectService.setLoginRedirectUrl(null);
            _this.routeService.justGo(['/', { outlets: { modal: null } }]);
        });
    };
    return AccountMenuComponent;
}(PaymentMaintenanceAffectedComponent));
export { AccountMenuComponent };
