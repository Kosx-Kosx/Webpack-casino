import { getLocaleNumberFormat, getLocaleNumberSymbol, NumberFormatStyle, NumberSymbol } from '@angular/common';
import { map } from 'rxjs/operators';
import { UserService } from 'app/user/user.service';
import { Currency } from './currencies.config';
import * as i0 from "@angular/core";
import * as i1 from "./currencies.config";
import * as i2 from "../user/user.service";
var CurrenciesService = /** @class */ (function () {
    function CurrenciesService(currentLocale, currencies, userService) {
        var _this = this;
        this.currentLocale = currentLocale;
        this.currencies = currencies;
        this.userService = userService;
        this.userCurrency$ = this.userService.currentUser.pipe(map(function (user) { return _this.currencies.find(function (currency) { return currency.code === user.currency; }); }));
    }
    CurrenciesService.prototype.isCurrencySignPrefix = function () {
        var currencyFormat = getLocaleNumberFormat(this.currentLocale, NumberFormatStyle.Currency);
        var currencyPosition = currencyFormat.indexOf('¤');
        // Assume currency is a prefix if it's positioned before the middle of the format
        return currencyPosition < currencyFormat.length / 2;
    };
    CurrenciesService.prototype.getCurrencyGroupSymbol = function () {
        return getLocaleNumberSymbol(this.currentLocale, NumberSymbol.CurrencyGroup);
    };
    CurrenciesService.prototype.getMask = function (symbol) {
        var prefixedCurrency = this.isCurrencySignPrefix();
        return {
            suffix: prefixedCurrency ? '' : symbol,
            prefix: prefixedCurrency ? symbol : '',
            thousands: this.getCurrencyGroupSymbol(),
            precision: 0,
            allowNegative: false,
            align: 'left',
        };
    };
    CurrenciesService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CurrenciesService_Factory() { return new CurrenciesService(i0.ɵɵinject(i0.LOCALE_ID), i0.ɵɵinject(i1.CURRENCIES_CONFIG), i0.ɵɵinject(i2.UserService)); }, token: CurrenciesService, providedIn: "root" });
    return CurrenciesService;
}());
export { CurrenciesService };
