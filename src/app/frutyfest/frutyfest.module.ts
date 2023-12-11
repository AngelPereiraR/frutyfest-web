import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrutyfestRoutingModule } from './frutyfest-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { MaterialModule } from '../material/material.module';
import { CommonBackgroundComponent } from './components/common-background/common-background.component';
import { ParticipantsComponent } from './pages/admin/participants/participants.component';
import { RecordComponent } from './pages/admin/record/record.component';
import { TeamTableComponent } from './pages/admin/team/team-table/team-table.component';
import { TeamAddComponent } from './pages/admin/team/team-add/team-add.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CommonBackgroundComponent,
    FrutyfestLayoutComponent,
    IndexComponent,
    RankingComponent,
    ParticipantsComponent,
    RecordComponent,
    TeamTableComponent,
    TeamAddComponent
  ],
  imports: [
    CommonModule,
    FrutyfestRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class FrutyfestModule { }
