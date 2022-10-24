import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewCategoryComponent } from '../new-category/new-category.component';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  isAdmin: any;

  //categoriaService:CategoryService estilo inyeccion de dependencia
  constructor(private categoriaService:CategoryService,
    public dialog: MatDialog, private snackBar: MatSnackBar, private util:UtilService) { }

  //cada que se carga un compoennte
  ngOnInit(): void {
    this.getCategorias();
    //console.log("roles metodo"+this.util.getRoles())
    
    this.isAdmin=this.util.isAdmin();
  }

  //crear el datasources para la tabla de categorias
  displayColumns: String[]=['id','nombre','descripcion','actions'];

  //interface que se crea CatgoryElement
  dataSource= new MatTableDataSource<CategoryElement>();

  //se respete la paginacion si pido 5 se den 5
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


 //si pide que sea un tipo de dato data cambia a data:any
  getCategorias(){
    this.categoriaService.getCategorias()
    .subscribe( (data:any) =>{
      console.log("mis categorias son", data);

      this.processCategoriesResponse(data);
    },(error:any) =>{
      console.log("error que pasa", error);
    })
  }


  //metodo que colocata lo de data a el datasources
  processCategoriesResponse(resp:any){
    const dataCategory: CategoryElement[]=[];
    //el metadata del srping dio el 00 que es respuesta correcta,categoryResponse viene al mosrar el f12
    if(resp.metadata[0].code=="00"){
      let listCategory = resp.categoriaResponse.categoria;

      listCategory.forEach((element:CategoryElement) => {
        dataCategory.push(element);
      });

      //estoy pasando la informacion del data a datasource
      this.dataSource= new MatTableDataSource<CategoryElement>(dataCategory);
      
      //se actualiza el paginator con el datasources
      this.dataSource.paginator = this.paginator;
    }
  }

  //va a abrir el dialog
  openCategoriaDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent , {
      width: '450px'
    });

    //cuando se cierra el dialogo pasa a este punto
    dialogRef.afterClosed().subscribe((result:any) => {
      
      //viene de new-cateogria.ts
      if( result == 1){
        //llamar metodo que  carga una forma de mnadar emnsajes de angular 
        this.openSnackBar("Categoria Agregada", "Exitosa");
        this.getCategorias();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar categoria", "Error");
      }
    });
  }

//una forma de mnadar emnsajes de angular , el retorno es : MatSnackBarRef<SimpleSnackBar>
//snackBar es lo declarado en constructor
  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000  //son dos segundos
    })

  }

  edit(id:number, nombre: string, descripcion: string){
    //abrimos el dialogo, 
    const dialogRef = this.dialog.open(NewCategoryComponent , {
      width: '450px',
      //pasar datos al componente que abrire
      data: {id: id, nombred: nombre, descripciond: descripcion}
    });

    

    dialogRef.afterClosed().subscribe((result:any) => {
      //si es uno la cat se actualizo
      if( result == 1){
        this.openSnackBar("Categoria Actualizada", "Exitosa");
        this.getCategorias();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar categoria", "Error");
      }
    });
  }


  //el dialogo sera de tipo ConfirmComponent
  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id,module: "categoria"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Categoria Eliminada", "Exitosa");
        this.getCategorias();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar categoria", "Error");
      }
    });
  }

  //metodo para buscar categoria por id
  buscar( termino: string){

    if( termino.length === 0){
      return this.getCategorias();
    }

    //busca la categoria por id, si es exitoso se manda a llmar el proceso para q actualice la tabla
    this.categoriaService.categoriaXId(termino)
            .subscribe( (resp: any) => {
              this.processCategoriesResponse(resp);
            })
  }

  //variable let de tipo blob el data qeu es al respuesta del api y el type q sera excel xslx
  //se utilizo javascrip en la variable anchor
  exportExcel(){
    this.categoriaService.exportarCategoria()
    .subscribe( (data:any)=>{
      let file = new Blob([data], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let fileUrl = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Categorias.xlsx"; //nombre del archivo y extencion
      anchor.href = fileUrl;
      anchor.click();

      this.openSnackBar("Categoria Exportadas", "Exitoso");
    } ,(error: any) =>{
      this.openSnackBar("No se exporto el archivo", "Error");
    })
    
  }



}

//crear las interfaces o tipos de datos que construyo para usarlos en tareas
export interface CategoryElement{
  id:number;
  nombre:string;
  descripcion:string;  
  
}
