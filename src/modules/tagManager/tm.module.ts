import { NgModule, NgModuleFactory } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { TagManagerRoutingModule } from './tm-routing.module';
import { TagManagerMaterialModule } from './tagManager-material.module';

import { SicknessComponent, EditDialogComponent, ConfigDialogComponent } from './sickness';
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
    AttributeHomeComponent
  ],
  imports: [
    TagManagerRoutingModule,
    FormsModule,
    CommonModule,
    TagManagerMaterialModule,
    HttpModule
  ],
  entryComponents: [
    EditDialogComponent,
    ConfigDialogComponent,
    DeptEditDialogComponent,
    AddDeptDialogComponent,
    PropertyEditDialogComponent
  ],
  providers: [DiseaseService, PropertySerivce]

})
export class TagManagerModule {}

export function loadTagManagerModule() {
  return TagManagerModule;
}

