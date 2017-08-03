import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdPaginatorModule,
  MdCardModule,
  MdDialogModule, MdIconModule, MdInputModule,
  MdTableModule,
  MdSelectModule,
  MdGridListModule
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
    MdGridListModule
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
    MdGridListModule
  ]
})
export class TagManagerMaterialModule {

}
