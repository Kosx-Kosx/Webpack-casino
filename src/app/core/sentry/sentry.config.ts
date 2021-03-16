import { InjectionToken } from '@angular/core';

import { EnvironmentType } from 'app/core/environment-type.type';

import { SentryGeneralFingerprint } from './sentry.interface';

export interface SentryConfig {
  /**
   * List of environments at which events should be sent to Sentry.
   */
  allowedEnvironments: EnvironmentType[];

  /**
   * If any of those fingerprints exist in the event, then sending event will be cancelled.
   *
   * If you need to un-ignore a specific class of errors per brand then consider
   * adding a separate Sentry project for this brand to avoid logging excessive number of events in the general project.
   *
   * Used to avoid sending known errors, which would eat up our bought events quota.
   */
  ignoredFingerprints: Array<string | SentryGeneralFingerprint>;

  /**
   * When present it will overwrite `ignoredFingerprints` for PROD environment.
   *
   * If any of those fingerprints exist in the event, then sending event will be cancelled.
   *
   * If you need to un-ignore a specific class of errors per brand then consider
   * adding a separate Sentry project for this brand to avoid logging excessive number of events in the general project.
   *
   * Used to avoid sending known errors, which would eat up our bought events quota.
   */
  ignoredFingerprintsProd?: Array<string | SentryGeneralFingerprint>;

  /**
   * `Dedupe` integration helps avoid duplicated events (https://docs.sentry.io/platforms/javascript/#sdk-integrations).
   * When previous event had the same fingerprint/stacktrace/message etc then event will be dropped.
   */
  deduplicateEvents?: boolean;
}

export const defaultSentryConfig: SentryConfig = {
  allowedEnvironments: [
    // 'localhost',
    // 'falcon',
    'staging',
    'production',
  ],
  ignoredFingerprints: [
    SentryGeneralFingerprint.ASSET_MISSING,
    SentryGeneralFingerprint.CONNECTION_FAILED_3RDPARTY,
    // SentryGeneralFingerprint.EXPRESSION_CHANGED,
    // SentryGeneralFingerprint.FAPI_CONNECTION_FAILED,
    // SentryGeneralFingerprint.FAPI_UNAUTHORIZED,
    SentryGeneralFingerprint.GAME_VENDOR_PROPERTIES,
    // SentryGeneralFingerprint.GRAPHQL_ERROR,
    // SentryGeneralFingerprint.HTTP_5xx_ERROR,
    SentryGeneralFingerprint.IOVATION_LOADER,
    // SentryGeneralFingerprint.LOADING_CHUNK_FAILED,
    // SentryGeneralFingerprint.NS_ERROR_NOT_INITIALIZED,
    SentryGeneralFingerprint.OMARSYS,
    SentryGeneralFingerprint.TIMEOUT,
  ],
  ignoredFingerprintsProd: [
    SentryGeneralFingerprint.APP_INITIALIZATION,
    // SentryGeneralFingerprint.ASSET_MISSING,
    SentryGeneralFingerprint.CONNECTION_FAILED_3RDPARTY,
    // SentryGeneralFingerprint.EXPRESSION_CHANGED,
    // SentryGeneralFingerprint.FAPI_CONNECTION_FAILED,
    SentryGeneralFingerprint.FAPI_UNAUTHORIZED,
    // SentryGeneralFingerprint.GAME_VENDOR_PROPERTIES,
    // SentryGeneralFingerprint.GRAPHQL_ERROR,
    // SentryGeneralFingerprint.HTTP_5xx_ERROR,
    // SentryGeneralFingerprint.IOVATION_LOADER,
    // SentryGeneralFingerprint.LOADING_CHUNK_FAILED,
    // SentryGeneralFingerprint.NS_ERROR_NOT_INITIALIZED,
    SentryGeneralFingerprint.OMARSYS,
    // SentryGeneralFingerprint.TIMEOUT,
  ],
  deduplicateEvents: true,
};

export const SENTRY_CONFIG = new InjectionToken<SentryConfig>('sentry-config', {
  providedIn: 'root',
  factory: () => defaultSentryConfig,
});
