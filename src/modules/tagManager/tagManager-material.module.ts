import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdPaginatorModule,
  MdCardModule,
  MdDialogModule, MdIconModule, MdInputModule,
  MdTableModule,
  MdSelectModule,
  MdSnackBarModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

@NgModule({
  imports: [
    CdkTableModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdPaginatorModule,
    MdTableModule,
    MdSelectModule,
    MdSnackBarModule
  ],
  exports: [
    CdkTableModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdPaginatorModule,
    MdTableModule,
    MdSelectModule,
    MdSnackBarModule
  ]
})
export class TagManagerMaterialModule {

}
