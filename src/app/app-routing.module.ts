import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutingModule } from './modules/dashboard/dashboard-routing.module';

const routes: Routes = [
  {path:'',pathMatch: 'full',redirectTo: '/dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {enableTracing: false, useHash:true }   //que en las rutas permita e gatouseHash
    ),
    DashboardRoutingModule  //traes toda la configuracion de ese archivo(ruas hijas)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
