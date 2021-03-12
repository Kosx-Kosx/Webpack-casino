import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';

import { JurisdictionService } from 'app/core/jurisdiction.service';
import { PusherService } from 'app/pusher';

@Injectable()
export class AutomaticPayoutListenerService {

  constructor(
    private jurisdictionService: JurisdictionService,
    private pusherService: PusherService,
    private router: Router,
  ) {
  }

  /**
   * Automatic payout feature is based on pusher message reaching FE, letting us know that user winnings reached
   * the specified threshold.
   */
  public initializePayoutListener() {
    this.jurisdictionService.isGermanyPlayer$.pipe(
      filter(v => !!v),
      switchMap(() => this.pusherService.on<{ threshold: number }>('winnings_counter_threshold_reached')),
    ).subscribe(msg => {
      this.router.navigate(['', {
        outlets: {
          modal: [ 'auto-payout', msg.threshold ],
        },
      }]);
    });
  }
}
