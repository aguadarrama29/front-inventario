import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  //variable para el modelo responsivo
  mobileQuery:MediaQueryList;

  //recibir valores del usuario logeado
  nombreUsuario: any;

  //arreglo para el menu que se itera en html
  menuNav = [
    {name:"Home",route: "home", icon:"home"},
    {name:"Categorias",route: "categoria", icon:"category"},
    {name:"Productos",route: "producto", icon:"production_quantity_limits"},
  ]

  constructor(media : MediaMatcher, private keycloakService: KeycloakService) { 
    this.mobileQuery=media.matchMedia('(max-width: 600px)')
  }

  ngOnInit(): void {
    this.nombreUsuario=this.keycloakService.getUsername();
  }

  logout(){
    this.keycloakService.logout();
  }

}
