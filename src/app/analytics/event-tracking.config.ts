import { InjectionToken } from '@angular/core';

export interface EventTrackingConfig {
  apiEndpoint: string;
  cookieName?: string;
  domain?: string;
  id?: string;
  pageViewEventName?: string;
}

export const EVENT_TRACKING_CONFIG = new InjectionToken<EventTrackingConfig>('EVENT_TRACKING_CONFIG');
