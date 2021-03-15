import { InjectionToken } from '@angular/core';

export const ACCOUNT_MENU_CONFIG = new InjectionToken<AccountMenuConfig>('account-menu-config');

export interface AccountMenuConfig {
  /**
   * Configuration used to interact with sticky header
   * `true`: add close button to sticky header section (option to go if you have header with content)
   * `false`: add close button to body modal section (no header content)
   */
  stickyCloseBtn: boolean;
}

export const defaultAccountMenuConfig: AccountMenuConfig = {
  stickyCloseBtn: true,
};
