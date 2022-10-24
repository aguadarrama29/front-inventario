import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {


  public categoryForm: FormGroup;

  estadoFormulario: string = "";
  constructor(private fb: FormBuilder, private categoryService: CategoryService,
            private dialogRef: MatDialogRef<NewCategoryComponent>, 
            @Inject(MAT_DIALOG_DATA) public data: any) {

    //ver que llega de datos desde el padre
    console.log(data);
    this.estadoFormulario = "Agregar";

    //inicializar y asiganr los campos que forman al formulario
    this.categoryForm = this.fb.group( {
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    //para que cuando actualice se pongan los datos
    if (data != null ){
      this.updateForm(data);
      this.estadoFormulario = "Actualizar";
    }
  }

  ngOnInit(): void {
  }

  onSave(){

    //crear jsondata para obtener los valores del input  form y asignar a jsondata
    //?.value si tiene un valor obtenlo
    let data = {
      nombre: this.categoryForm.get('nombre')?.value,
      descripcion: this.categoryForm.get('descripcion')?.value
    }

    if (this.data != null ){
      //update registry
      this.categoryService.updateCategoria(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
              })
    } else {
      //create new registry
      this.categoryService.saveCatgoria(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
    }
    

  }

  //accon del boton cancelar
  onCancel(){
    this.dialogRef.close(3);

  }

  //metodo que recibe el data de el constructor
  updateForm(data: any){
    //actualizo el formulario con los valores que me llegaron
    this.categoryForm = this.fb.group( {
      nombre: [data.nombred, Validators.required],
      descripcion: [data.descripciond, Validators.required]
    });

  }

}
