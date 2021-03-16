import { InjectionToken } from '@angular/core';

export interface Currency {
  code: string;
  symbol: string;
  /**
   * If set to false, user won't get this currency on registration even if it is explicitly defined
   * within chosen country (in data from FAPI).
   *
   * Example: FAPI returns EUR currency for Germany, but with EUR set to false on some casino,
   * the first enabled currency (the default one for given brand) will be chosen instead.
   */
  enabled: boolean;
  prefix?: boolean;
  payment: {
    defaults: {
      deposit: number;
      withdraw: number;
    };
    quickOptions: {
      deposit: number[];
      withdraw: number[];
    };
  };
}

export const defaultCurrenciesConfig: Currency[] = [
  {
    code: 'EUR',
    symbol: '€',
    enabled: true,
    payment: {
      defaults: {
        deposit: 30,
        withdraw: 20,
      },
      quickOptions: {
        deposit: [30, 50, 100, 150, 300, 500],
        withdraw: [],
      },
    },
  },
  {
    code: 'SEK',
    symbol: 'kr',
    enabled: true,
    payment: {
      defaults: {
        deposit: 300,
        withdraw: 100,
      },
      quickOptions: {
        deposit: [300, 500, 1000, 1500, 2500, 4000],
        withdraw: [],
      },
    },
  },
  {
    code: 'NOK',
    symbol: 'kr',
    enabled: true,
    payment: {
      defaults: {
        deposit: 300,
        withdraw: 100,
      },
      quickOptions: {
        deposit: [300, 500, 1000, 1500, 2500, 4000],
        withdraw: [],
      },
    },
  },
];

export const CURRENCIES_CONFIG = new InjectionToken<Currency[]>('currencies');
