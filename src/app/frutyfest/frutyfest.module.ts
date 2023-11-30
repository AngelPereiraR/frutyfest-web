import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrutyfestRoutingModule } from './frutyfest-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { MaterialModule } from '../material/material.module';
import { CommonBackgroundComponent } from './components/common-background/common-background.component';
import { ParticipantsComponent } from './pages/admin/participants/participants.component';


@NgModule({
  declarations: [
    CommonBackgroundComponent,
    FrutyfestLayoutComponent,
    IndexComponent,
    RankingComponent,
    ParticipantsComponent,
  ],
  imports: [
    CommonModule,
    FrutyfestRoutingModule,
    MaterialModule
  ]
})
export class FrutyfestModule { }
