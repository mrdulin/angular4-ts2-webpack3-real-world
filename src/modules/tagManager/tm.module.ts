import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { TagManagerRoutingModule } from './tm-routing.module';
import { TagManagerMaterialModule } from './tagManager-material.module';

import { SicknessComponent, EditDialogComponent, ConfigDialogComponent } from './sickness';
import { DepartmentComponent } from './department';
import { AttributeComponent } from './attribute';

import { DiseaseService, DiseaseConfigService } from 'root/src/services';

@NgModule({
  declarations: [
    SicknessComponent,
    DepartmentComponent,
    AttributeComponent,
    EditDialogComponent,
    ConfigDialogComponent
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
    ConfigDialogComponent
  ],
  providers: [DiseaseService, DiseaseConfigService]

})
export class TagManagerModule {

}
