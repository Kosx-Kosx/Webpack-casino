import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CasinoGameComponent } from './casino-game.component';
import { CasinoGameGuard } from './casino-game.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id',
        component: CasinoGameComponent,
        canActivate: [ CasinoGameGuard ],
        canDeactivate: [ CasinoGameGuard ],
        data: {
          showToggleMenuForDesktop: true,
          ionMenuSwipeEnabledForDesktop: true,
          isSearchBarVisible: true,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasinoGameRoutingModule { }
