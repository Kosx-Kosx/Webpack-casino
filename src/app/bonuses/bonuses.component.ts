import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';

import { Bonus } from 'app/core/bonus.model';
import { BonusService } from 'app/core/bonus.service';
import { easeInOut } from 'app/shared/animations/animations';
import { AnimationsHelper } from 'app/shared/animations/animations.helper';
import { UserService } from 'app/user';

import { BONUSES_CONFIG, BonusesConfig } from './bonuses.config';

export enum BonusGroup {
  ACTIVE = 0,
  AVAILABLE = 1,
  CLAIMED = 2,
}

export interface BonusesData {
  active: Bonus[];
  available: Bonus[];
  claimed: Bonus[];
}

@Component({
  selector: 'xc-bonuses',
  templateUrl: './bonuses.component.html',
  styleUrls: ['./bonuses.component.scss'],
  animations: [easeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusesComponent {
  bonusGroupType = BonusGroup;
  easeInOutDurationParams = AnimationsHelper.getDurationParams('.5s');

  loading = true;
  currentTab: BonusGroup = BonusGroup.ACTIVE;
  isSgaPlayer$: Observable<boolean>;

  bonuses$: Observable<BonusesData> =  this.bonusService.bonusCancelled$.pipe(
    startWith(null),
    switchMap(() => forkJoin(
      this.bonusService.getActive(),
      this.bonusService.getAvailable(),
      this.bonusService.getClaimed(),
    )),
    map(([active, available, claimed]) => ({ active, available, claimed })),
    tap(() => {
      this.loading = false;
      this.changeDetector.markForCheck();
    }),
  );

  constructor(
    @Inject(BONUSES_CONFIG) public config: BonusesConfig,
    private bonusService: BonusService,
    private changeDetector: ChangeDetectorRef,
    private userService: UserService,
  ) {
    this.isSgaPlayer$ = this.userService.isSgaPlayer$;
  }

  switchTab(tab: BonusGroup) {
    this.currentTab = tab;
  }
}
