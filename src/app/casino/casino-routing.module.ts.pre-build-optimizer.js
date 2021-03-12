import { Routes } from '@angular/router';
import { CasinoComponent } from './casino.component';
var ɵ0 = {
    isLobbyActive: true,
}, ɵ1 = {
    isLobbyActive: true,
};
export var routes = [
    {
        path: '',
        component: CasinoComponent,
        data: ɵ0,
    },
    {
        path: ':category',
        component: CasinoComponent,
        data: ɵ1,
    },
];
var CasinoRoutingModule = /** @class */ (function () {
    function CasinoRoutingModule() {
    }
    return CasinoRoutingModule;
}());
export { CasinoRoutingModule };
export { ɵ0, ɵ1 };
