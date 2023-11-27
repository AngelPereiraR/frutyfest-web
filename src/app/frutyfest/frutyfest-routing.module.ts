import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrutyfestLayoutComponent } from './layouts/frutyfest-layout/frutyfest-layout.component';
import { IndexComponent } from './pages/index/index.component';
import { PruebaComponent } from './pages/admin/prueba/prueba.component';

const routes: Routes = [
  {
    path: '',
    component: FrutyfestLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
      },
      {
        path: 'admin',
        component: PruebaComponent
      },
      {
        path: '**',
        redirectTo: '/'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrutyfestRoutingModule { }
