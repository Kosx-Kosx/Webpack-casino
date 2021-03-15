import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

import { PlatformService } from 'app/core/platform.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  public get googleAnalyticsClientId(): string {
    const gaCookie = this.platformService.window.document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('_ga'));
    return gaCookie && gaCookie.match(/(\d{2,}\.\d{2,})/g)[0] || null;
  }

  constructor(
    private angulartics: Angulartics2,
    private platformService: PlatformService,
  ) {
  }

  public send(action: string, trackedProperties: any): void {
    trackedProperties.gaClientId = this.googleAnalyticsClientId;
    this.angulartics.eventTrack.next({
      action,
      properties: {
        ...trackedProperties,
        gtmCustom: trackedProperties,
      },
    });
  }
}
