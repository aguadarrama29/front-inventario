import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductoService } from 'src/app/modules/shared/services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //objetos para grafico de barra y 
  charBar: any;
  charDona: any;

  constructor(private productoServices: ProductoService) { }

  ngOnInit(): void {
    this.getProductos();
  }

  //obtener los productos, se copia codigo de seccion 
  getProductos(){
    this.productoServices.getProductos()
    .subscribe( (data:any) =>{
      console.log("que passa",data);
      this.processProductosResponse(data);
    },(error:any) =>{
      console.log("error al buscar productos", error);
    })
  }


   //metodo que colocata lo de data a el datasources
   processProductosResponse(resp:any){
   
    //arreglos apra guardar los valores
    const nameProducto: String [] = [];
    const cantidadProducto: number [] = [];

    //el metadata del srping dio el 00 que es respuesta correcta,producto.productos viene al mosrar el f12
    if(resp.metadata[0].code=="00"){
      let listProductos = resp.producto.productos;

      listProductos.forEach((element:ProductoElement) => {
        nameProducto.push(element.nombre);
        cantidadProducto.push(element.cantidad);       
      });      

      //crear el grafico de barras
      //en la variableinstanciamos un objeto (identificador, caracteristicas)
      this.charBar= new  Chart('canvas-bar',{
        type: 'bar',
        data:{
          labels:nameProducto,
          datasets: [
            {label:'Productos',  data: cantidadProducto}
          ]
        }
      });

      //grafico  tipo dona--doughnut
      this.charDona= new  Chart('canvas-dona',{
        type: 'doughnut',
        data:{
          labels:nameProducto,
          datasets: [
            {label:'Productos-circular',  data: cantidadProducto}
          ]
        }
      });

    }
  }

}

//crear la interfaces que va adefinir el ememento producto(los mismos del modelo en spring)
export interface ProductoElement{
  id:number;
  nombre: string;
  precio: number;
  cantidad: number;
  categoria: any;
  foto: any;

}
