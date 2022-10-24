import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

//acceder a variable de enviroment
const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  //metodo que se conectara al API REST para buscar todas las categorias
  getCategorias(){
    //armar el end point de la aplicacion  AltGr + } } eso es igual a ``(backtick)
    const endpoint=`${base_url}/obtenerCategorias`;
    return this.http.get(endpoint);
    //regresa un observable
  }


  //medoto para guardar una categoria
  saveCatgoria(body:any){
    const endpoint= `${base_url}/guardarCategoria`;
    return this.http.post(endpoint,body);
  }

   //medoto para actualizar una categoria
   updateCategoria(body:any,id:any){
    const endpoint= `${base_url}/categorias/${id}`;
    return this.http.put(endpoint,body);
  }

   //medoto para eliminar una categoria
   eliminarCategoria(id:any){
    const endpoint= `${base_url}/eliminarCategoria/${id}`;
    return this.http.delete(endpoint);
  }

  //obtener categoria por Id
  categoriaXId(id:any){
    const endpoint= `${base_url}/categoria/${id}`;
    return this.http.get(endpoint);
  }

  //exportar una categoria a excel
  exportarCategoria(){
    const endpoint= `${base_url}/categoria/export/excel`;
    return this.http.get(endpoint,{
      responseType: 'blob'}); //exportar un tipo blob q viene del api
  }

}
