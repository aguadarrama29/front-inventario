import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modules/dashboard/pages/dashboard.component';
import { HomeComponent } from './modules/dashboard/components/home/home.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {KeycloakService, KeycloakAngularModule} from 'keycloak-angular'

//ya cuample que si no estas logeado te manda al login para poder acceder
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://ssoinventory-my-proyecto.apps-crc.testing/auth', //antes http://localhost:8080/auth
        realm: 'inventario',//imss_ldapv2
        clientId: 'angular-client-inventario'
      },
      initOptions: {
        onLoad: 'login-required',//colocar  como carga de pagina
        flow: "standard",
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      },
      loadUserProfileAtStartUp: true  //obtener informacion delusuario que se a logeado y mostrarla en la aplicacion

    });
}


@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    BrowserAnimationsModule,

    KeycloakAngularModule
  ],
  
  providers: [
    //cuando se inicie la aplicacion se ejecute el metodo initializeKeycloak
    //es el que hace la integracion con keycloak se coloco mas arriba
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
