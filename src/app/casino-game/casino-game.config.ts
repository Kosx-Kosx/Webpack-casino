import { InjectionToken } from '@angular/core';

import { Jurisdiction } from 'app/core/jurisdiction.type';

export interface CasinoGameConfig {
  /**
   * On which jurisdiction(s) link to /info/responsible-gaming should be shown.
   *
   * Will not be used in any if omitted.
   */
  responsibleGamingLinkJurisdictions?: Jurisdiction[];

  /**
   * Vendors whose mobile games should display in an iframe rather than being redirected.
   * We do it eg. when vendor doesn't support in-game reality check
   * or for vendors which don't support mobile redirection (eg. Netent).
   * Please note that jurisdiction must also match in order to use iframe
   * and user has to be logged in.
   *
   * `true` displays game in an iframe for all jurisdictions.
   */
  mobileIframeVendors?: {[key: string]: string[] | boolean};

  /**
   * Enable showing modal which offers to login/register after 1 minute of playing a game
   * and once more after 1 minute since closing the first modal.
   *
   * Available on desktop only (mobiles are not using iframe for PFF).
   */
  showConversionModal?: boolean;
}

export const defaultCasinoGameConfig: CasinoGameConfig = {
  mobileIframeVendors: {
    netent: [
      'mga',
      'germany',
    ],
  },
  showConversionModal: false,
};

export const CASINO_GAME_CONFIG = new InjectionToken<CasinoGameConfig>('casino-game-config', {
  providedIn: 'root',
  factory: () => defaultCasinoGameConfig,
});
