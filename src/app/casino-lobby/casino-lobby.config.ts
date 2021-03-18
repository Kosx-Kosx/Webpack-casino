import { InjectionToken } from '@angular/core';

export interface CasinoLobbyConfig {
  /**
   * If casino needs to display game details under thumb it can setup this configuration to true.
   * For expanded details to work correctly cassino cannot use layouts that have more than 1 row.
   */
  useExpandedDetails: boolean;
  /**
   * This configuration is required to correctly calculate position of expanded game details.
   * Casino that uses it needs to have layouts of only one specific width and basing on that width
   * amounts of visible columns should be provided in this configuration.
   */
  layoutColumnsPerSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const CASINO_LOBBY_CONFIG = new InjectionToken<CasinoLobbyConfig>('casino-lobby-config');

export const defaultCasinoLobbyConfig: CasinoLobbyConfig = {
  // in general we don't use expanded view it would require reconfiguration of layouts in most casinos
  useExpandedDetails: false,
  // configuration for layouts of size 2x1
  layoutColumnsPerSize: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
};
