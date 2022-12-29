import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  freshnessList = ["Brand New", "Second Hand"];
  productForm !: FormGroup
  actionBtn:string = "Save"

  constructor(private formBuilder:FormBuilder,
   private api : ApiService, 
   @Inject(MAT_DIALOG_DATA) public editData :any,
   private dialogRef :  MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      vehicleName: ['',Validators.required],
      category: ['',Validators.required],
      freshness:['',Validators.required],
      price: ['',Validators.required],
      features: ['',Validators.required],
      date: ['',Validators.required]
    });

     if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['vehicleName'].setValue(this.editData.vehicleName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['features'].setValue(this.editData.features);
      this.productForm.controls['date'].setValue(this.editData.date);

     }
  }

  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("product added successfully")
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
           alert("Error while adding the product")
          }
        })
      }
    }else{
      this.updateProduct()
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product Updated Successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
       alert("Error while updating the record!!");
      }
    })
  }
}
