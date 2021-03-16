import { getLocaleNumberFormat, getLocaleNumberSymbol, NumberFormatStyle, NumberSymbol } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { map } from 'rxjs/operators';

import { UserService } from 'app/user/user.service';

import { Currency, CURRENCIES_CONFIG } from './currencies.config';

@Injectable({ providedIn: 'root' })
export class CurrenciesService {

  public userCurrency$ = this.userService.currentUser.pipe(
    map(user => this.currencies.find(currency => currency.code === user.currency)),
  );

  constructor(
    @Inject(LOCALE_ID) private currentLocale: string,
    @Inject(CURRENCIES_CONFIG) private currencies: Currency[],
    private userService: UserService,
  ) {}

  isCurrencySignPrefix(): boolean {
    const currencyFormat = getLocaleNumberFormat(this.currentLocale, NumberFormatStyle.Currency);
    const currencyPosition = currencyFormat.indexOf('¤');
    // Assume currency is a prefix if it's positioned before the middle of the format
    return currencyPosition < currencyFormat.length / 2;
  }

  getCurrencyGroupSymbol(): string {
    return getLocaleNumberSymbol(this.currentLocale, NumberSymbol.CurrencyGroup);
  }

  getMask(symbol: string): Partial<CurrencyMaskConfig> {
    const prefixedCurrency = this.isCurrencySignPrefix();
    return {
      suffix: prefixedCurrency ? '' : symbol,
      prefix: prefixedCurrency ? symbol : '',
      thousands: this.getCurrencyGroupSymbol(),
      precision: 0,
      allowNegative: false,
      align: 'left',
    };
  }

}
