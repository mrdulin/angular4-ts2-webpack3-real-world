import { NgModule } from '@angular/core';
import {
  MdDialogModule,
  MdButtonModule,
  MdSnackBarModule
} from '@angular/material';

@NgModule({
  exports: [
    MdDialogModule,
    MdButtonModule,
    MdSnackBarModule
  ]
})
export class AppMaterialModule { }
