import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { ActionService } from 'app/core/action.service';
import { Bonus } from 'app/core/bonus.model';
import { BonusService } from 'app/core/bonus.service';

import { BONUSES_CONFIG, BonusesConfig } from '../bonuses.config';

@Component({
  selector: 'xc-available-bonuses',
  templateUrl: './available-bonuses.component.html',
  styleUrls: [ './available-bonuses.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableBonusesComponent {
  @Input() bonuses: Bonus[] = [];

  constructor(
    @Inject(BONUSES_CONFIG) public config: BonusesConfig,
    private actionService: ActionService,
    private bonusService: BonusService,
    private router: Router,
  ) { }

  deposit(bonus: Bonus) {
    this.bonusService.storeBonus(bonus);
    this.router.navigate(this.actionService.getRouterLink('deposit').commands);
  }
}
