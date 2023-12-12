import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { IndexComponent } from './pages/index/index.component';
import { isNotAdminGuard } from './guards/is-not-admin.guard';
import { ParticipantsComponent } from './pages/admin/participants/participants.component';
import { RecordComponent } from './pages/admin/record/record.component';
import { TeamTableComponent } from './pages/admin/team/team-table/team-table.component';
import { TeamAddComponent } from './pages/admin/team/team-add/team-add.component';
import { TemporalteamTableComponent } from './pages/admin/temporalteam/temporalteam-table/temporalteam-table.component';
import { TemporalteamAddComponent } from './pages/admin/temporalteam/temporalteam-add/temporalteam-add.component';

const routes: Routes = [
  {
    path: '',
    component: FrutyfestLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
        pathMatch: 'full'
      },
      {
        path: 'admin',
        canActivate: [isNotAdminGuard],
        component: ParticipantsComponent
      },
      {
        path: 'admin/record/:id',
        canActivate: [isNotAdminGuard],
        component: RecordComponent
      },
      {
        path: 'admin/team',
        canActivate: [isNotAdminGuard],
        component: TeamTableComponent
      },
      {
        path: 'admin/team/add',
        canActivate: [isNotAdminGuard],
        component: TeamAddComponent
      },
      {
        path: 'admin/temporal',
        canActivate: [isNotAdminGuard],
        component: TemporalteamTableComponent
      },
      {
        path: 'admin/temporal/add',
        canActivate: [isNotAdminGuard],
        component: TemporalteamAddComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrutyfestRoutingModule { }
