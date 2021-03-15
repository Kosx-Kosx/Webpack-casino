import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivatePhoneComponent } from './activate-phone.component';

export const routes: Routes = [
  {
    path: ':phone',
    component: ActivatePhoneComponent,
    data: {
      title: 'Activation',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivatePhoneRoutingModule { }
