import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from '../category/components/category/category.component';
import { ProductoComponent } from '../producto/producto/producto.component';
import { HomeComponent } from './components/home/home.component';

//cuando el path sea vacio llamar a este componente
const childRoutes : Routes = [
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'categoria', component: CategoryComponent},
    { path: 'producto', component: ProductoComponent}
]

@NgModule({
    imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class RouterChildModule { }

