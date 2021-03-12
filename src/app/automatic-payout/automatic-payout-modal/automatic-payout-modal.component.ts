import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ActionService } from 'app/core/action.service';
import { CurrenciesService } from 'app/core/currencies.service';
import { ModalComponent } from 'app/modal/modal.component';

@Component({
  selector: 'xc-automatic-payout-modal',
  templateUrl: './automatic-payout-modal.component.html',
  styleUrls: ['./automatic-payout-modal.component.scss'],
})
export class AutomaticPayoutModalComponent implements OnInit {
  @ViewChild(ModalComponent, { static: false }) public modal: ModalComponent;

  public loading = true;
  public showForm = false;
  public threshold: number;
  public userCurrency: string;

  constructor(
    public actionService: ActionService,
    private route: ActivatedRoute,
    private currenciesService: CurrenciesService,
  ) {
  }

  ngOnInit() {
    this.threshold = this.route.snapshot.params['threshold'];

    this.currenciesService.userCurrency$.pipe(
      take(1),
    ).subscribe(currency => {
      this.userCurrency = currency.code;
      this.loading = false;
    });
  }
}
