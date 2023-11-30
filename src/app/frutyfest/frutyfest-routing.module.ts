import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { IndexComponent } from './pages/index/index.component';
import { isNotAdminGuard } from './guards/is-not-admin.guard';
import { ParticipantsComponent } from './pages/admin/participants/participants.component';
import { isNotAuthenticatedGuard } from '../auth/guards/is-not-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: FrutyfestLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [isNotAuthenticatedGuard],
        component: IndexComponent,
        pathMatch: 'full'
      },
      {
        path: 'admin',
        canActivate: [isNotAdminGuard],
        component: ParticipantsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrutyfestRoutingModule { }
