import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ActionService } from './action.service';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class ActionListenerService {

  constructor(
    private location: Location,
    private actionService: ActionService,
    private router: Router,
    private platform: PlatformService,
  ) {
    platform.window.addEventListener('message', this.listener.bind(this));
  }

  listener(event: MessageEvent) {
    const data = event.data;

    /* We should not trigger callback when:
      - there is no event data (Relax issue XCAF-1615)
      - the action is our own action (xc-action)
      - there is nothing provided as action for callback
    */
    if (!data || data.type !== 'xc-action' || !data.action) {
      return;
    }

    this.process(data.action, data.params);
  }

  process(action: string, params: any = {}) {
    switch (action) {
      case 'reload':
        return this.platform.location.reload();
      case 'back':
        return this.location.back();
      default:
        const url = this.actionService.getHref(action, params);
        return this.router.navigateByUrl(url);
    }
  }

}
