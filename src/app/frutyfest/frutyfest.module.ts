import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrutyfestRoutingModule } from './frutyfest-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    IndexComponent,
    RankingComponent,
    FrutyfestLayoutComponent
  ],
  imports: [
    CommonModule,
    FrutyfestRoutingModule,
    MaterialModule
  ]
})
export class FrutyfestModule { }
