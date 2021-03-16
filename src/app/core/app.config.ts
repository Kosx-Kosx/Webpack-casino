import { InjectionToken } from '@angular/core';

export interface AppConfig {
  prefix: string;
  title: {
    brandName: string;
    separator: string;
  };
  /**
   * Do not use dots in brand names as they are used in FAPI request as seperators for devices.
   */
  brand: string;
  curacaoLicense?: string;
  mgaLicense?: string;
  phoneActivation: boolean;
  /** option for turning on fragments of code for special handling (users from Japan) on brand */
  japaneseFeatures: boolean;
  bankIdEnabled: boolean;
  /** Enables Mentor integration (Risk Profile, Risk Messages) */
  riskFeaturesEnabled: boolean;
  /**
   * A value in milliseconds that defines how long one mentor message toastr should be visible.
   *
   * Defaults to 5000 (five seconds) if omitted.
   */
  mentorMessageLife?: number;
  /**
   * A value in milliseconds that defines how long the interval between displaying mentor messages should be.
   *
   * Defaults to 20000 (twenty seconds) if omitted.
   */
  mentorMessageInterval?: number;
  /**
   * Enable a mode in which every navigation to deposit or withdraw page will open a modal instead.
   *
   * To supplement this change, The following features need to be used:
   * - to get data for router in TS, use ActionService.getRouterLink('deposit') or ActionService.getRouterLink('withdraw')
   * - to navigate to deposit page from template, use xcGoToDeposit directive
   * - to navigate to withdraw page from template, use xcGoToWithdraw directive
   *
   * If false, modal will be only available if opened explicitly (f.e. from game view)
   */
  paymentsInModalOnly: boolean;

  /**
   * Enable a mode in which every navigation to deposit or withdraw page will open in the sidenav instead
   */
  paymentsInSidenavOnly?: boolean;

  /**
   * Defines if given brand will track organic traffic id on affiliates (TCR-388)
   */
  trackOrganicTrafficID?: boolean;

  /**
   * Redirect to lobby non-existing pages eq: /info/spanish-inquisition
   */
  redirectToLobbyNonExistingPages?: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app-config');
