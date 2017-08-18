import { NgModule, NgModuleFactory } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { TagManagerRoutingModule } from './tm-routing.module';
import { TagManagerMaterialModule } from './tagManager-material.module';

import {
  SicknessComponent,
  EditDialogComponent,
  ConfigDialogComponent,
  CreateDialogComponent
} from './sickness';
import { DepartmentComponent, DeptEditDialogComponent, AddDeptDialogComponent } from './department';
import { AttributeComponent, PropertyEditDialogComponent, AttrEditComponent, AttributeHomeComponent } from './attribute';

import { DiseaseService, PropertySerivce } from 'root/src/services';

@NgModule({
  declarations: [
    SicknessComponent,
    DepartmentComponent,
    AttributeComponent,
    EditDialogComponent,
    ConfigDialogComponent,
    DeptEditDialogComponent,
    AddDeptDialogComponent,
    PropertyEditDialogComponent,
    AttrEditComponent,
    AttributeHomeComponent,
    CreateDialogComponent
  ],
  imports: [
    TagManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    TagManagerMaterialModule
  ],
  entryComponents: [
    EditDialogComponent,
    ConfigDialogComponent,
    DeptEditDialogComponent,
    AddDeptDialogComponent,
    PropertyEditDialogComponent,
    CreateDialogComponent
  ],
  providers: [DiseaseService, PropertySerivce]

})
export class TagManagerModule {}

export function loadTagManagerModule() {
  return TagManagerModule;
}

