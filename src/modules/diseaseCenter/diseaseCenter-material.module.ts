import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonModule,
  MdInputModule,
  MdCheckboxModule,
  MdCardModule,
  MdTabsModule,
  MdDialogModule,
  MdPaginatorModule,
  MdChipsModule,
  MdTableModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

@NgModule({
  imports: [
    MdButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdCardModule,
    MdTabsModule,
    MdDialogModule,
    MdPaginatorModule,
    MdChipsModule,
    MdTableModule,
    CdkTableModule,
    CommonModule
  ],
  exports: [
    MdButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdCardModule,
    MdTabsModule,
    MdDialogModule,
    MdPaginatorModule,
    MdChipsModule,
    MdTableModule,
    CdkTableModule,
    CommonModule
  ]
})
export class DiseaseCenterMaterialModule {

}
