import { InjectionToken } from '@angular/core';

/**
 * Config object for bonuses module.
 *
 * As of now, most fields are optional because defaults are most common considering all brands.
 * If you don't need any of them to be changed, just don't provide the config in casino.
 */
export interface BonusesConfig {
  /** Setting this to true will organize the active, available, and claimed bonuses into separate tabs. */
  tabView?: boolean;

  /**
   * Setting this to true will show the AVAILABLE bonuses as carousel, instead of a list.
   *
   * Also, it will cause setting readMoreEnabled flag to true obsolete, since due to design of bonuses in
   * carousel, read more link for long descriptions has to be there anyway.
   */
  carouselEnabled?: boolean;

  /**
   * Whether or not long descriptions of available bonuses should be collapsed with 'read more' link present at the end.
   *
   * Do not bother setting this to true if carouselEnabled is already on, as this behavior is forced there.
   */
  readMoreEnabled?: boolean;

  /**
   * Whether or not ACTIVE bonuses should have description.
   */
  activeBonusDescription?: boolean;

  /**
   * Sets given color variant for active bonus cancellation button.
   */
  activeCancelBtnColor: 'primary' | 'secondary' | 'tertiary';

  /**
   * Sets given color variant for active bonus cancellation button.
   */
  voucherClaimBtnColor: 'primary' | 'secondary' | 'tertiary';
}

export const defaultBonusesConfig: BonusesConfig = {
  activeCancelBtnColor: 'secondary',
  voucherClaimBtnColor: 'secondary',
};

export const BONUSES_CONFIG = new InjectionToken<BonusesConfig>('bonuses-config', {
  providedIn: 'root',
  factory: () => defaultBonusesConfig,
});
