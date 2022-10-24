import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { ProductoService } from '../../shared/services/producto.service';
import { UtilService } from '../../shared/services/util.service';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  //segun su rol de keycloak true si es admin
  isAdmin: any;

  constructor(private productoServices: ProductoService,
    public dialog: MatDialog, private snackBar: MatSnackBar, private util:UtilService) { }

  //de los primeros metodos que se inician al entrar al modulo
  ngOnInit(): void {
    this.getProductos();
    //asignar el valor segun rol 
    this.isAdmin=this.util.isAdmin();
  }

  //crear el datasources para la tabla de categorias
  displayColumns: String[]=['id','nombre','precio','cantidad','categoria','foto','actions'];

  //interface que se crea ProductoElement importar
  dataSource= new MatTableDataSource<ProductoElement>();

  //se respete la paginacion si pido 5 se den 5 importar
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

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
    const dataProducto: ProductoElement[]=[];
    //el metadata del srping dio el 00 que es respuesta correcta,producto.productos viene al mosrar el f12
    if(resp.metadata[0].code=="00"){
      let listProductos = resp.producto.productos;

      listProductos.forEach((element:ProductoElement) => {
        //asignar al ProductoElement en su propiedad categoria el nombre de la cateoria
        //que viene en el response
      
        //  element.categoria=element.categoria.nombre; para mostrar la categoria en select debo mandar todo el objeto

        //interpretar la foto que viene en base64 , se le agrega el prefijo mas lo q contiene el campo foto
        element.foto='data:image/jpeg;base64,'+element.foto;
        dataProducto.push(element);
      });

      //estoy pasando la informacion del data a datasource
      this.dataSource= new MatTableDataSource<ProductoElement>(dataProducto);
      
      //se actualiza el paginator con el datasources
      this.dataSource.paginator = this.paginator;
    }
  }


  openProductDialog(){
    const dialogRef = this.dialog.open(NewProductComponent , {
      width: '450px'
    });

    //cuando se cierra el dialogo pasa a este punto
    dialogRef.afterClosed().subscribe((result:any) => {
      
      //result viene de new-prodcuct.ts
      if( result == 1){
        //llamar metodo que  carga una forma de mnadar emnsajes de angular
        this.openSnackBar("Producto Agregado", "Exitosa");
        this.getProductos();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar producto", "Error");
      }
    });
  }

  //una forma de mnadar emnsajes de angular , el retorno es : MatSnackBarRef<SimpleSnackBar>
//snackBar es lo declarado en constructor
  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 4000  //4 seg
    })

  }

  edit(id:number, name: string, price: number, account: number, category: any){
    console.log(category);
    //para abrir el dialogo
    const dialogRef = this.dialog.open(NewProductComponent , {
      width: '450px', 
      //enviar estos datos al new-producto(form)      
      data: {id: id, nombrenp: name, precionp: price, cantidadnp: account, categorianp: category}
    });

    //q pasa cuando se cierra el dialog
    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Producto editado", "Exitosa");
        this.getProductos();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar producto", "Error");
      }
    });

  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px', 
      data: {id: id, module: "producto"} //module es una bandera para q este componente sea dinamico
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Producto eliminado", "Exitosa");
        this.getProductos();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar producto", "Error");
      }
    });

  }


  buscar(name: any){
    if ( name.length === 0){
      return this.getProductos();
    }

    this.productoServices.getProductByName(name)
        .subscribe( (resp: any) =>{
          this.processProductosResponse(resp);
        })
  }

  //variable let de tipo blob el data qeu es al respuesta del api y el type q sera excel xslx
  //se utilizo javascrip en la variable anchor
  exportExcel(){
    this.productoServices.exportarProducto()
    .subscribe( (data:any)=>{
      let file = new Blob([data], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let fileUrl = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Productos.xlsx"; //nombre del archivo y extencion
      anchor.href = fileUrl;
      anchor.click();

      this.openSnackBar("Productos Exportadas", "Exitoso");
    } ,(error: any) =>{
      this.openSnackBar("No se exporto el archivo", "Error");
    })
    
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
