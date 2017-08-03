import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { TagManagerRoutingModule } from './tm-routing.module';
import { TagManagerMaterialModule } from './tagManager-material.module';

import { SicknessComponent, EditDialogComponent } from './sickness';
import { DepartmentComponent } from './department';
import { AttributeComponent } from './attribute';

@NgModule({
  declarations: [
    SicknessComponent,
    DepartmentComponent,
    AttributeComponent,
    EditDialogComponent
  ],
  imports: [
    TagManagerRoutingModule,
    FormsModule,
    CommonModule,
    TagManagerMaterialModule,
    HttpModule
  ],
  entryComponents: [EditDialogComponent]
})
export class TagManagerModule {

}
