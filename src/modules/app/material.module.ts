import { NgModule } from '@angular/core';
import {
  MdDialogModule,
  MdButtonModule,
  MdSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [
    MdDialogModule,
    MdButtonModule,
    MdSnackBarModule
  ],
  exports: [
    MdDialogModule,
    MdButtonModule,
    MdSnackBarModule
  ]
})
export class MaterialModule { }
