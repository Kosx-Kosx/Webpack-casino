import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CasinoComponent } from './casino.component';

export const routes: Routes = [
  {
    path: '',
    component: CasinoComponent,
    data: {
      isLobbyActive: true,
    },
  },
  {
    path: ':category',
    component: CasinoComponent,
    data: {
      isLobbyActive: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasinoRoutingModule { }
