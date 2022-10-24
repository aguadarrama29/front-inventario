import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//acceder a variable de enviroment
const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http:HttpClient) { }

  //metodo que se conectara al API REST para buscar todos los productos
  getProductos(){
    //armar el end point de la aplicacion  AltGr + } } eso es igual a ``(backtick)
    const endpoint=`${base_url}/obtenerAllProductos`;
    return this.http.get(endpoint);
    //regresa un observable
  }

  //medoto para guardar una producto
  saveProducto(body:any){
    const endpoint= `${base_url}/guardaProducto`;
    return this.http.post(endpoint,body);
  }

  /**
   * update product
   */
   actualizarProduct (body: any, id: any){
    const endpoint = `${ base_url}/actualizaProducto/ ${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete product
   */
   deleteProduct(id: any){
    const endpoint = `${ base_url}/eliminarProducto/ ${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by name si entre el / y el aprametro hay un esapcio da error
   */
  getProductByName(name: any){
    const endpoint = `${ base_url}/productosXNombre/${name}`;
    return this.http.get(endpoint);
  }

    //exportar productos a excel
    exportarProducto(){
      const endpoint= `${base_url}/productos/export/excel`;
      return this.http.get(endpoint,{
        responseType: 'blob'}); //exportar un tipo blob q viene del api
    }

}
