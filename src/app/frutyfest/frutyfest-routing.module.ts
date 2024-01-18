import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
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
import { Info01Component } from './pages/info/info-01/info-01.component';
import { Info02Component } from './pages/info/info-02/info-02.component';
import { RateComponent } from './pages/admin/rate/rate.component';

const routes: Routes = [
  {
    path: '',
    component: FrutyfestLayoutComponent,
    children: [
      {
        path: '',
        component: Info02Component,
        pathMatch: 'full',
      },
      {
        path: 'frutyfest01',
        component: Info01Component,
      },
      {
        path: 'admin',
        canActivate: [isNotAdminGuard],
        component: ParticipantsComponent,
      },
      {
        path: 'participant/:id',
        canActivate: [isNotParticipantGuard],
        component: InfoComponent,
      },
      {
        path: 'participant/edit/:id',
        canActivate: [isNotParticipantGuard],
        component: EditComponent,
      },
      {
        path: 'participant/changePassword/:id',
        canActivate: [isNotParticipantGuard],
        component: ParticipantChangePasswordComponent,
      },
      {
        path: 'admin/record/:id',
        canActivate: [isNotAdminGuard],
        component: RecordComponent,
      },
      {
        path: 'admin/team',
        canActivate: [isNotAdminGuard],
        component: TeamTableComponent,
      },
      {
        path: 'admin/team/add',
        canActivate: [isNotAdminGuard],
        component: TeamAddComponent,
      },
      {
        path: 'admin/trial',
        canActivate: [isNotAdminGuard],
        component: TrialTableComponent,
      },
      {
        path: 'admin/trial/add',
        canActivate: [isNotAdminGuard],
        component: TrialAddComponent,
      },
      {
        path: 'admin/rate',
        canActivate: [isNotAdminGuard],
        component: RateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrutyfestRoutingModule {}
