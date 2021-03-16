import { InjectionToken } from '@angular/core';

import { EventTrackingConfig } from 'app/analytics/event-tracking.config';

export interface EnvConfig {
  production: boolean;
  apiEndpoint: string;

  eventTracking?: EventTrackingConfig;
  /**
   * Local path to the first-party static loader.
   * Build process copies this file from `src/iovation` to the root directory.
   * To copy the file on localhost you need to build the brand before serving.
   */
  iovationScript?: string;
  pushcrewId?: string;
  /**
   * The test site keys never challenge users.
   * https://docs.xcaliber.io/confluence/display/CM/Google+ReCaptcha+keys
   * Added site key will enable captcha only if it was enabled in BO as well (Content/Settings).
   */
  reCaptchaSiteKey?: string;
  salesforceUrl?: string;
  /**
   * Frequency of showing up RC modal after logging in (in seconds).
   *
   * Applies for login time based RC.
   */
  loginBasedRealityCheckFrequency?: number;
  /**
   * Frequency of showing up RC modal after placing the first bet in a game (in seconds)
   *
   * Applies for first bet based RC.
   */
  betBasedRealityCheckFrequency?: number;
  pusher: {
    logToConsole: boolean;

    /**
     * Cluster from configured pusher app.
     * Example: eu
     */
    cluster: string;

    /**
     * Key from configured pusher app.
     */
    key: string;

    /**
     * Key from from configured pusher app for sso (SingleSignOn) features
     */
    sso_key?: string;
  };
  /**
   * Allowed endpoint to accept data from with postMessages (security)
   */
  paypiEndpoint: string;
  /**
   * Turns on/off console logs done with logger.
   */
  consoleLogs: boolean;
  /*
   * Data source name - tells where to send the events to
   * https://docs.sentry.io/error-reporting/configuration/?platform=browser
   */
  sentryDsn?: string;
  /**
   * Script url to load Clever Push Notification
   */
  cleverPushScript?: string;
  /**
   * Script url to load addThis - It's a platform that allow users to share content on social media
   * https://www.addthis.com/
   */
  addThisScript?: string;
  /**
   * Cooling period length. Unit is seconds.
   */
  coolDownPeriod?: number;
  /**
   * Cooling period length. Unit is seconds.
   */
  coolOffPeriod?: number;
  /**
   * Frequency in which the Germany Welcome Back Modal is displayed.
   */
  welcomeBackGermanyFrequency?: number;
}

export const ENVIRONMENT = new InjectionToken<EnvConfig>('environment');
