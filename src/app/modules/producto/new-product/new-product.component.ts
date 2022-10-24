import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ProductoService } from 'src/app/modules/shared/services/producto.service';


export interface Category{
  descripcion: string;
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  public productForm: FormGroup;
  estadoFormulario: string = "";
  categories: Category[]=[];
  selectedFile: any;
  nameImg: string ="";

  constructor(private fb: FormBuilder, private categoryService: CategoryService,
    private productoServices: ProductoService, private dialogRef: MatDialogRef<NewProductComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.estadoFormulario = "Agregar";
      this.productForm = this.fb.group( {
        nombre: ['', Validators.required],
        precio: ['', Validators.required],
        cantidad: ['', Validators.required],
        categoria: ['', Validators.required],
        foto: ['', Validators.required]
      })

      //en caso de que sea actualizar los datos no seran null
      if (data != null ){
        this.updateForm(data);
        this.estadoFormulario = "Actualizar";
      }

    }


  ngOnInit(): void {
    this.getCategories()
  }

  onSave(){
    let data = {
      name: this.productForm.get('nombre')?.value,
      price: this.productForm.get('precio')?.value,
      account: this.productForm.get('cantidad')?.value,
      category: this.productForm.get('categoria')?.value,
      picture: this.selectedFile
    }
    console.log("que trae daaaaa",data)
    const uploadImageData = new FormData();
    uploadImageData.append('foto', data.picture, data.picture.name);
    uploadImageData.append('nombre', data.name);
    uploadImageData.append('precio', data.price);
    uploadImageData.append('cantidad', data.account);
    uploadImageData.append('categoriaId', data.category);


    if (this.data != null){
      //update the product
      this.productoServices.actualizarProduct(uploadImageData, this.data.id)
                .subscribe( (data: any) =>{
                  this.dialogRef.close(1);
                }, (error: any) => {
                  this.dialogRef.close(2);
                })
    } else {
      //call the service to save a product
      this.productoServices.saveProducto(uploadImageData)
              .subscribe( (data: any) =>{  //cuando devuelva la info el servicio lo almaceno en un data y con lambda
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
    }

  }

  onCancel(){
    this.dialogRef.close(3);
  }

  getCategories(){
    this.categoryService.getCategorias()
        .subscribe( (data: any) =>{
          this.categories = data.categoriaResponse.categoria;
        }, (error: any) =>{
          console.log("error al consultar categorias");
        })
  }


  onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }

  updateForm(data: any){

    this.productForm = this.fb.group( {
      nombre: [data.nombrenp, Validators.required],
      precio: [data.precionp, Validators.required],
      cantidad: [data.cantidadnp, Validators.required],
      categoria: [data.categorianp.id, Validators.required],
      foto: ['', Validators.required]
    })
  }

}
