import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/user';

import { AutomaticPayoutModalComponent } from './automatic-payout-modal/automatic-payout-modal.component';

export const routes: Routes = [
  {
    path: 'auto-payout/:threshold',
    outlet: 'modal',
    component: AutomaticPayoutModalComponent,
    canActivate: [ AuthGuard ],
    data: {
      title: 'Automatic Payout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomaticPayoutRoutingModule { }
