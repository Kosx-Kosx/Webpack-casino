import { Router } from '@angular/router';
import { LayoutConfig } from 'app/layout/layout.config';
import { AppConfig } from './app.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./app.config";
import * as i3 from "../layout/layout.config";
var ActionService = /** @class */ (function () {
    function ActionService(router, appConfig, layoutConfig) {
        this.router = router;
        this.appConfig = appConfig;
        this.layoutConfig = layoutConfig;
    }
    ActionService.prototype.getHref = function (action, params) {
        if (params === void 0) { params = {}; }
        // Login redirection are handled by guards
        action = action.replace('login_', '');
        if (action === 'link') {
            return params.url;
        }
        var urlTree = this.getUrlTree(action, params);
        return this.router.serializeUrl(urlTree);
    };
    ActionService.prototype.getUrlTree = function (action, params) {
        if (params === void 0) { params = {}; }
        var routerLink = this.getRouterLink(action, params);
        return this.router.createUrlTree(routerLink.commands, routerLink.navigationExtras);
    };
    ActionService.prototype.getRouterLink = function (action, params) {
        if (params === void 0) { params = {}; }
        var hasParams = params ? !!Object.keys(params).length : 0;
        if (action === 'link') {
            return { commands: ['', { outlets: { primary: params.url, modal: null } }] };
        }
        switch (action) {
            case 'promotion':
            case 'promotions':
                return hasParams
                    ? { commands: ['', { outlets: { modal: ['promotions', (params.slug || params.id)] } }] }
                    : { commands: ['', { outlets: { primary: 'promotions', modal: null } }] };
            case 'bonuses':
            case 'deposit':
            case 'deposit_bonus': // used by promo cta's to pass a bonus id to query params before deposit
                var navigationExtras = hasParams ? { queryParams: { bonus: params.bonus_id } } : undefined;
                return { commands: this.getPaymentsCommands('deposit'), navigationExtras: navigationExtras };
            case 'withdraw':
                return { commands: this.getPaymentsCommands('withdraw') };
            case 'pending-withdrawals':
                return {
                    commands: this.appConfig.paymentsInSidenavOnly
                        ? ['', { outlets: { aside: 'wallet' } }]
                        : this.getPaymentsCommands('withdraw'),
                };
            case 'faq': // should we change something in BO?
                return { commands: ['', { outlets: { primary: ['info', params.category], modal: null } }] };
            case 'play':
            case 'game':
            case 'games':
                return hasParams
                    ? { commands: ['', { outlets: { primary: ['play', (params.slug || params.id)], modal: null } }] }
                    : { commands: ['', { outlets: { primary: 'casino', modal: null } }] };
            case 'lotteries':
                return hasParams
                    ? { commands: ['', { outlets: { primary: ['lotto', (params.slug || params.id)], modal: null } }] }
                    : { commands: ['', { outlets: { primary: 'lotto', modal: null } }] };
            case 'register':
                return { commands: ['', { outlets: { modal: 'register' } }] };
            case 'login':
                return { commands: ['', { outlets: { modal: 'login' } }] };
            case 'scratch_cards':
                return { commands: ['', { outlets: { primary: 'scratch-cards', modal: null } }] };
            case 'game-sessions':
                return this.getGameSessionsCommands();
            case 'responsible-gaming':
                return {
                    commands: this.layoutConfig.accountMenuInSidenav
                        ? ['', { outlets: { aside: ['account', 'settings', 'responsible-gaming', 'limits'], modal: null } }]
                        : ['', { outlets: { primary: ['account', 'activity', 'game-sessions'], modal: null } }],
                };
            case 'communication':
            case 'sports':
            case 'mypage':
            default:
                return { commands: ['', { outlets: { primary: action, modal: null } }] };
        }
    };
    ActionService.prototype.getGameSessionsCommands = function () {
        var isCasinoActivityRouteAvailable = this.router.config.find(function (route) { return route.path === 'casino-activity'; });
        var outlets;
        if (isCasinoActivityRouteAvailable) {
            outlets = { primary: ['casino-activity', 'game-sessions'], modal: null };
        }
        else {
            var accountRoute = this.router.config.find(function (route) { return route.path === 'account'; });
            if (accountRoute && accountRoute.outlet === 'aside') {
                outlets = { aside: ['account', 'activity', 'game-sessions'], modal: null };
            }
            else {
                outlets = { primary: ['account', 'activity', 'game-sessions'], modal: null };
            }
        }
        return { commands: ['', { outlets: outlets }] };
    };
    ActionService.prototype.getPaymentsCommands = function (type) {
        var commands;
        if (this.appConfig.paymentsInSidenavOnly) {
            commands = ['', { outlets: { aside: type, modal: null } }];
        }
        else if (this.appConfig.paymentsInModalOnly) {
            commands = ['', { outlets: { modal: type } }];
        }
        else {
            commands = ['', { outlets: { primary: ['cashier', type], modal: null } }];
        }
        return commands;
    };
    ActionService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ActionService_Factory() { return new ActionService(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.APP_CONFIG), i0.ɵɵinject(i3.LAYOUT_CONFIG)); }, token: ActionService, providedIn: "root" });
    return ActionService;
}());
export { ActionService };
