import { Injectable, Inject } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import * as Tracking from 'cherrytech-event-tracking-js-sdk';

import { EVENT_TRACKING_CONFIG, EventTrackingConfig } from './event-tracking.config';

@Injectable({ providedIn: 'root' })
export class Angulartics2EventTracking {
  private tracker: any;

  constructor(
    angulartics2: Angulartics2,
    @Inject(EVENT_TRACKING_CONFIG) config: EventTrackingConfig,
  ) {
    // Should enable event tracking only if there is config for it.
    if (config) {
      this.tracker = Tracking.createTracker(config.id || 'tracker', config);

      angulartics2.pageTrack
        .pipe(angulartics2.filterDeveloperMode())
        .subscribe(page => this.pageTrack(page.path));

      angulartics2.eventTrack
        .pipe(angulartics2.filterDeveloperMode())
        .subscribe(event => this.eventTrack(event.action, event.properties));

      angulartics2.setUsername
        .pipe(angulartics2.filterDeveloperMode())
        .subscribe(username => this.setUsername(username));

      angulartics2.setUserProperties
        .pipe(angulartics2.filterDeveloperMode())
        .subscribe(properties => this.setUserProperties(properties));
    }
  }

  private pageTrack(path: string) {
    this.tracker.trackPageView({ path });
  }

  private eventTrack(action: string, properties: any) {
    this.tracker.track(action, properties);
  }

  private setUsername(username: string | { userId: string | number }) {
    this.tracker.identify(username);
  }

  private setUserProperties(properties: any) {
    this.tracker.identify(properties.id, properties);
  }
}
