import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private keycloakService: KeycloakService) { }

  getRoles(){
    return this.keycloakService.getUserRoles();
  }

  //metodo para saber si es admin o no
  isAdmin(){
    //obtenemos el arreglo de roles que regresa el metodo se recorre y se guaran en la variable
    //los que sean igual a admin
    let roles=this.keycloakService.getUserRoles().filter(role => role == "admin");

    //si la lista es mayor a 0 si es admin
    if(roles.length > 0)
      return true;
    else
      return false;
  }
}
