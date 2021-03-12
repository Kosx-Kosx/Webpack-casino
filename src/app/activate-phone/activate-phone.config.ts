import { InjectionToken } from '@angular/core';

export interface ActivatePhoneConfig {
  activateResendDelay: number;

  /**
   * When to show promotion within the aside of the modal
   */
  showPromotion: 'always' | 'never' | 'only-on-desktop';

  /**
   * When true show the close btn on the bottom of the modal
   */
  showCloseBtn?: boolean;

  /**
   * When true enable click/hover action on whole help information row and change text of action to icon.
   */
  enableActionOnClickHelpRow?: boolean;

  /**
   * Sets given color variant for activate phone confirm button.
   */
  confirmButtonColor?: 'primary' | 'secondary';
}

export const ACTIVATE_PHONE_CONFIG = new InjectionToken<ActivatePhoneConfig>('phone-config');
export const activatePhoneConfig: ActivatePhoneConfig = {
  showPromotion: 'only-on-desktop',
  activateResendDelay: 5 * 60 * 1000,
  showCloseBtn: false,
  enableActionOnClickHelpRow: false,
  confirmButtonColor: 'primary',
};
