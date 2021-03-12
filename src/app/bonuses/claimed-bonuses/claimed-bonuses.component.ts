import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Bonus } from 'app/core/bonus.model';

@Component({
  selector: 'xc-claimed-bonuses',
  templateUrl: './claimed-bonuses.component.html',
  styleUrls: [ './claimed-bonuses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimedBonusesComponent {
  @Input() bonuses: Bonus[] = [];
}
