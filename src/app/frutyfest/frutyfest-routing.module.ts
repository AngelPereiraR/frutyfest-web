import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { IndexComponent } from './pages/index/index.component';
import { isNotAdminGuard } from './guards/is-not-admin.guard';
import { ParticipantsComponent } from './pages/admin/participants/participants.component';
import { RecordComponent } from './pages/admin/record/record.component';
import { TeamTableComponent } from './pages/admin/team/team-table/team-table.component';
import { TeamAddComponent } from './pages/admin/team/team-add/team-add.component';
import { TrialAddComponent } from './pages/admin/trial/trial-add/trial-add.component';
import { TrialTableComponent } from './pages/admin/trial/trial-table/trial-table.component';
import { InfoComponent } from './pages/participants/info/info.component';
import { isNotParticipantGuard } from './guards/is-not-participant.guard';
import { EditComponent } from './pages/participants/edit/edit.component';
import { ParticipantChangePasswordComponent } from './pages/participants/participant-change-password/participant-change-password.component';

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
        path: 'participant/:id',
        canActivate: [isNotParticipantGuard],
        component: InfoComponent
      },
      {
        path: 'participant/edit/:id',
        canActivate: [isNotParticipantGuard],
        component: EditComponent
      },
      {
        path: 'participant/changePassword/:id',
        canActivate: [isNotParticipantGuard],
        component: ParticipantChangePasswordComponent
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
        path: 'admin/trial',
        canActivate: [isNotAdminGuard],
        component: TrialTableComponent
      },
      {
        path: 'admin/trial/add',
        canActivate: [isNotAdminGuard],
        component: TrialAddComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrutyfestRoutingModule { }
