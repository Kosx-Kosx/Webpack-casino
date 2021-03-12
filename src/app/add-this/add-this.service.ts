import { Injectable, Inject } from '@angular/core';
import { switchMap, tap, delay } from 'rxjs/operators';

import { ENVIRONMENT, EnvConfig } from 'app/core/environment.config';
import { PlatformService } from 'app/core/platform.service';
import { RouteService } from 'app/core/route.service';

@Injectable()
export class AddThisService {

  constructor(
    @Inject(ENVIRONMENT) private environment: EnvConfig,
    private platformService: PlatformService,
    private routeService: RouteService,
  ) { }

  initialize() {
    if (this.environment.addThisScript) {
      this.platformService.loadExternalScript('add-this-script', this.environment.addThisScript)
        .pipe(
          switchMap(() => this.routeService.navigation$),
          delay(500),
          tap(() => {
            if (this.platformService.window.addthis.layers.initialized) {
              this.platformService.window.addthis.layers.refresh();
            }
          }),
        ).subscribe();
    }
  }
}
