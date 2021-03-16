import { Inject, Injectable } from '@angular/core';

import { ENVIRONMENT, EnvConfig } from './environment.config';

@Injectable({ providedIn: 'root' })
export class Logger {
  constructor(
    @Inject(ENVIRONMENT) private environment: EnvConfig,
  ) {
  }

  public log(...args: any[]) {
    if (this.environment.consoleLogs) {
      // tslint:disable:no-console
      console.log(...args);
    }
  }

  public warn(...args: any[]) {
    if (this.environment.consoleLogs) {
      // tslint:disable:no-console
      console.warn(...args);
    }
  }

  public error(...args: any[]) {
    if (this.environment.consoleLogs) {
      // tslint:disable:no-console
      console.error(...args);
    }
  }
}
