import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivateMailModalComponent } from './activate-mail-modal/activate-mail.modal.component';

export const routes: Routes = [
  {
    path: 'activate/:code',
    redirectTo: '/(modal:activate-mail/:code)',
  },
  {
    path: 'activate-mail/:code',
    outlet: 'modal',
    component: ActivateMailModalComponent,
    data: {
      title: 'Activate',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivateMailRoutingModule { }
