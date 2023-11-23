import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrutyfestRoutingModule } from './frutyfest-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { MaterialModule } from '../material/material.module';
import { CommonBackgroundComponent } from './components/common-background/common-background.component';


@NgModule({
  declarations: [
    IndexComponent,
    RankingComponent,
    FrutyfestLayoutComponent,
    CommonBackgroundComponent
  ],
  imports: [
    CommonModule,
    FrutyfestRoutingModule,
    MaterialModule
  ]
})
export class FrutyfestModule { }
