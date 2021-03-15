import { Routes } from '@angular/router';
import { AuthGuard } from 'app/user';
import { AutomaticPayoutModalComponent } from './automatic-payout-modal/automatic-payout-modal.component';
var ɵ0 = {
    title: 'Automatic Payout',
};
export var routes = [
    {
        path: 'auto-payout/:threshold',
        outlet: 'modal',
        component: AutomaticPayoutModalComponent,
        canActivate: [AuthGuard],
        data: ɵ0,
    },
];
var AutomaticPayoutRoutingModule = /** @class */ (function () {
    function AutomaticPayoutRoutingModule() {
    }
    return AutomaticPayoutRoutingModule;
}());
export { AutomaticPayoutRoutingModule };
export { ɵ0 };
