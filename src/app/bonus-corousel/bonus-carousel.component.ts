import { Component, Input, OnDestroy, EventEmitter, Output } from '@angular/core';

import { Bonus } from 'app/core/bonus.model';
import { HtmlContentComponent } from 'app/modal-shared/html-content/html-content.component';
import { ModalService } from 'app/modal/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xc-bonus-carousel',
  templateUrl: './bonus-carousel.component.html',
  styleUrls: ['./bonus-carousel.component.scss'],
})
export class BonusCarouselComponent implements OnDestroy {

  @Input() bonuses: Bonus[];
  @Output() bonusSelected = new EventEmitter<Bonus>();

  carouselOffset = 0;

  private sub: Subscription;

  constructor(
    private modalService: ModalService,
  ) {
  }

  openTermsModal(bonus: Bonus) {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    const componentRef = this.modalService.attachComponentModal<HtmlContentComponent>(HtmlContentComponent);

    componentRef.instance.title = bonus.name;
    componentRef.instance.content = bonus.terms_and_conditions;

    this.sub = componentRef.instance.closed.subscribe(() => {
      this.modalService.closeModal(componentRef);
    });

    return componentRef.instance.closed;
  }

  selectBonus(bonus: Bonus) {
    this.bonusSelected.emit(bonus);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
