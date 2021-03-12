import { InjectionToken } from '@angular/core';

export const ACCOUNT_CONFIG = new InjectionToken<AccountConfig>('account-config');

export interface AccountConfig {
  /**
   * When true, will enable displaying additional balances in wallet component.
   * Besides main balance component could display as well: Real, Bonus.
   */
  displayAdditionalBalances: boolean;

  /**
   * Activate ability to add image to wallet page
   * @see manekichi wallet
   */
  walletLayoutWithImage: boolean;

  /**
   * When true, will enable displaying slider tabs with account options.
   */
  displaySliderTabs?: boolean;
}

export const accountConfig: AccountConfig = {
  displayAdditionalBalances: false,
  walletLayoutWithImage: false,
  displaySliderTabs: true,
};
