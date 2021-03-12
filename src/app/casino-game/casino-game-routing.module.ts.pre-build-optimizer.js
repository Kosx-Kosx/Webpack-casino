import { Routes } from '@angular/router';
import { CasinoGameComponent } from './casino-game.component';
import { CasinoGameGuard } from './casino-game.guard';
var ɵ0 = {
    showToggleMenuForDesktop: true,
    ionMenuSwipeEnabledForDesktop: true,
    isSearchBarVisible: true,
};
export var routes = [
    {
        path: '',
        children: [
            {
                path: ':id',
                component: CasinoGameComponent,
                canActivate: [CasinoGameGuard],
                canDeactivate: [CasinoGameGuard],
                data: ɵ0,
            },
        ],
    },
];
var CasinoGameRoutingModule = /** @class */ (function () {
    function CasinoGameRoutingModule() {
    }
    return CasinoGameRoutingModule;
}());
export { CasinoGameRoutingModule };
export { ɵ0 };
