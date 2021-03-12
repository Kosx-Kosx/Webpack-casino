import { Component, Inject, Input, ChangeDetectionStrategy } from '@angular/core';

import { Bonus } from 'app/core/bonus.model';
import { HtmlContentComponent } from 'app/modal-shared/html-content/html-content.component';
import { ModalService } from 'app/modal/modal.service';

import { BONUSES_CONFIG, BonusesConfig } from '../bonuses.config';

@Component({
  selector: 'xc-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusComponent {
  @Input() bonus: Bonus;
  @Input() mode: 'available' | 'claimed' | 'active' = 'available';

  constructor(
    @Inject(BONUSES_CONFIG) public config: BonusesConfig,
    private modalService: ModalService,
  ) {
  }

  createModal(title: string, content: string) {
    const componentRef = this.modalService.attachComponentModal<HtmlContentComponent>(HtmlContentComponent);

    componentRef.instance.title = title;
    componentRef.instance.content = content;

    componentRef.instance.closed.subscribe(() => {
      this.modalService.closeModal(componentRef);
    });

    return componentRef.instance.closed;
  }

  openTerms(bonus: Bonus) {
    this.createModal(bonus.name, bonus.terms_and_conditions);
  }

  get isDisabled(): boolean {
    return this.mode === 'available' && !this.bonus.can_award;
  }
}
