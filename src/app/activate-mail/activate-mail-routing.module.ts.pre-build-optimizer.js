import { Routes } from '@angular/router';
import { ActivateMailModalComponent } from './activate-mail-modal/activate-mail.modal.component';
var ɵ0 = {
    title: 'Activate',
};
export var routes = [
    {
        path: 'activate/:code',
        redirectTo: '/(modal:activate-mail/:code)',
    },
    {
        path: 'activate-mail/:code',
        outlet: 'modal',
        component: ActivateMailModalComponent,
        data: ɵ0,
    },
];
var ActivateMailRoutingModule = /** @class */ (function () {
    function ActivateMailRoutingModule() {
    }
    return ActivateMailRoutingModule;
}());
export { ActivateMailRoutingModule };
export { ɵ0 };
