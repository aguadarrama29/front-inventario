import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfirmComponent } from './components/confirm/confirm.component';



@NgModule({
  declarations: [
    SidenavComponent,
    ConfirmComponent
  ],

  //crear metadata para que sea visible en otros modulos
  exports:[
    SidenavComponent
  ] ,

  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    //para qeu la aplicacion al hacer routeos llegue al sidenav
    RouterModule,
    //para pdoer trabajar con el servicio
    HttpClientModule
  ]
})
export class SharedModule { }
