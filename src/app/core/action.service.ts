import { Injectable, Inject } from '@angular/core';
import { Router, UrlTree, NavigationExtras } from '@angular/router';

import { LAYOUT_CONFIG, LayoutConfig } from 'app/layout/layout.config';

import { APP_CONFIG, AppConfig } from './app.config';

@Injectable({ providedIn: 'root' })
export class ActionService {

  constructor(
    private router: Router,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(LAYOUT_CONFIG) private layoutConfig: LayoutConfig,
  ) {
  }

  getHref(action: string, params: any = {}): string {
    // Login redirection are handled by guards
    action = action.replace('login_', '');

    if (action === 'link') {
      return params.url;
    }

    const urlTree = this.getUrlTree(action, params);
    return this.router.serializeUrl(urlTree);
  }

  getUrlTree(action: string, params: any = {}): UrlTree {
    const routerLink = this.getRouterLink(action, params);
    return this.router.createUrlTree(routerLink.commands, routerLink.navigationExtras);
  }

  getRouterLink(action: string, params: any = {}): { commands: any[], navigationExtras?: NavigationExtras } {
    const hasParams = params ? !!Object.keys(params).length : 0;

    if (action === 'link') {
      return { commands: ['', { outlets: { primary: params.url, modal: null }}] };
    }

    switch (action) {
      case 'promotion':
      case 'promotions':
        return hasParams
          ? { commands: ['', { outlets: { modal: ['promotions', (params.slug || params.id)] } }]}
          : { commands: ['', { outlets: { primary: 'promotions', modal: null } }]};
      case 'bonuses':
      case 'deposit':
      case 'deposit_bonus': // used by promo cta's to pass a bonus id to query params before deposit
        const navigationExtras: NavigationExtras = hasParams ? { queryParams: { bonus: params.bonus_id } } : undefined;
        return { commands: this.getPaymentsCommands('deposit'), navigationExtras };
      case 'withdraw':
        return { commands: this.getPaymentsCommands('withdraw') };
      case 'pending-withdrawals':
        return {
          commands: this.appConfig.paymentsInSidenavOnly
            ? ['', { outlets: { aside: 'wallet' } }]
            : this.getPaymentsCommands('withdraw'),
        };
      case 'faq': // should we change something in BO?
        return { commands: ['', { outlets: { primary: ['info', params.category], modal: null } }]};
      case 'play':
      case 'game':
      case 'games':
        return hasParams
          ? { commands: ['', { outlets: { primary: ['play', (params.slug || params.id)], modal: null } }]}
          : { commands: ['', { outlets: { primary: 'casino', modal: null } }]};
      case 'lotteries':
        return hasParams
          ? { commands: ['', { outlets: { primary: ['lotto', (params.slug || params.id)], modal: null } }]}
          : { commands: ['', { outlets: { primary: 'lotto', modal: null }}]};
      case 'register':
        return { commands: ['', { outlets: { modal: 'register' } }]};
      case 'login':
        return { commands: ['', { outlets: { modal: 'login' } }]};
      case 'scratch_cards':
        return { commands: ['', { outlets: { primary: 'scratch-cards', modal: null }}]};
      case 'game-sessions':
        return this.getGameSessionsCommands();
      case 'responsible-gaming':
        return {
          commands: this.layoutConfig.accountMenuInSidenav
            ? ['', { outlets: { aside: ['account', 'settings', 'responsible-gaming', 'limits'], modal: null }}]
            : ['', { outlets: { primary: ['account', 'activity', 'game-sessions'], modal: null }}],
        };
      case 'communication':
      case 'sports':
      case 'mypage':
      default:
        return { commands: ['', { outlets: { primary: action, modal: null } }] };
    }
  }

  getGameSessionsCommands(): { commands: any[], navigationExtras?: NavigationExtras } {
    const isCasinoActivityRouteAvailable = this.router.config.find((route) => route.path === 'casino-activity');
    let outlets;
    if (isCasinoActivityRouteAvailable) {
      outlets = { primary: ['casino-activity', 'game-sessions'], modal: null };
    } else {
      const accountRoute = this.router.config.find((route) => route.path === 'account');
      if (accountRoute && accountRoute.outlet === 'aside') {
        outlets = { aside: ['account', 'activity', 'game-sessions'], modal: null };
      } else {
        outlets =  { primary: ['account', 'activity', 'game-sessions'], modal: null };
      }
    }
    return { commands: ['', { outlets }]};
  }

  getPaymentsCommands(type: string): any[] {
    let commands: any[];
    if (this.appConfig.paymentsInSidenavOnly) {
      commands = ['', { outlets: { aside: type, modal: null } }];
    } else if (this.appConfig.paymentsInModalOnly) {
      commands = ['', { outlets: { modal: type } }];
    } else {
      commands = ['', { outlets: { primary: ['cashier', type], modal: null } }];
    }
    return commands;
  }
}
