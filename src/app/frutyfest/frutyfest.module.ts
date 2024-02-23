import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrutyfestRoutingModule } from './frutyfest-routing.module';
import { RankingComponent } from './components/ranking/ranking.component';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { MaterialModule } from '../material/material.module';
import { CommonBackgroundComponent } from './components/common-background/common-background.component';
import { ParticipantsComponent } from './pages/admin/participants/participants.component';
import { RecordComponent } from './pages/admin/record/record.component';
import { TeamTableComponent } from './pages/admin/team/team-table/team-table.component';
import { TeamAddComponent } from './pages/admin/team/team-add/team-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticipantsListComponent } from './components/participants-list/participants-list.component';
import { TrialTableComponent } from './pages/admin/trial/trial-table/trial-table.component';
import { TrialAddComponent } from './pages/admin/trial/trial-add/trial-add.component';
import { InfoComponent } from './pages/participants/info/info.component';
import { EditComponent } from './pages/participants/edit/edit.component';
import { ParticipantChangePasswordComponent } from './pages/participants/participant-change-password/participant-change-password.component';
import { Info01Component } from './pages/info/info-01/info-01.component';
import { Info02Component } from './pages/info/info-02/info-02.component';
import { RateComponent } from './pages/admin/rate/rate.component';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

@NgModule({
  declarations: [
    CommonBackgroundComponent,
    FrutyfestLayoutComponent,
    RankingComponent,
    ParticipantsComponent,
    RecordComponent,
    TeamTableComponent,
    TeamAddComponent,
    ParticipantsListComponent,
    TrialTableComponent,
    TrialAddComponent,
    InfoComponent,
    EditComponent,
    ParticipantChangePasswordComponent,
    Info01Component,
    Info02Component,
    RateComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    FrutyfestRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
})
export class FrutyfestModule {}
