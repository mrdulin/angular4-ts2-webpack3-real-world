import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdPaginatorModule,
  MdCardModule,
  MdDialogModule, MdIconModule, MdInputModule,
  MdTableModule,
  MdSelectModule
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
    MdSelectModule
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
    MdSelectModule
  ]
})
export class TagManagerMaterialModule {

}
