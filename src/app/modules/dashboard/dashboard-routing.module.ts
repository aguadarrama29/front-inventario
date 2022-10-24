import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';

//generar archivo de rutas
export const routes: Routes = [
    {
        path: 'dashboard', 
        component: DashboardComponent,
        loadChildren: () => import('./router-child.module').then(m => m.RouterChildModule)
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]  //quedar visible para el aplicativo
})
export class DashboardRoutingModule { }
