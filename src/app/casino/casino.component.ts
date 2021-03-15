import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { CASINO_CONFIG, CasinoConfig } from 'app/core/casino.config';
import { RouteService } from 'app/core/route.service';

@Component({
  selector: 'xc-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.scss'],
})
export class CasinoComponent {

  constructor(
    private route: ActivatedRoute,
    public routeService: RouteService,
    @Inject(CASINO_CONFIG) public casinoConfig: CasinoConfig,
  ) { }

  category$: Observable<string> = this.route.params
    .pipe(
      pluck('category'),
    );

  lobby$: Observable<string> = this.route.params
    .pipe(
      pluck('lobby'),
    );

}
