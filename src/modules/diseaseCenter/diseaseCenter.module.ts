import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { diseaseHomeComponent } from './diseaseHome';
import { entranceManagerComponent } from './diseaseHome/entranceManager';
import { UploadModule } from '../../common/components/upload';
import { UploadComponent } from '../../common/components/upload/upload.component';
import { EntranceEdit } from './diseaseHome/entranceManager/editDialog/editDialog.component';

import { DiseaseCenterRoutingModule } from './diseaseCenter-routing.module';
import { DiseaseCenterMaterialModule } from './diseaseCenter-material.module';

import { EntranceService } from 'root/src/services'
import { EntranceEditService } from 'root/src/services'

@NgModule({
  declarations: [
    UploadComponent,
    diseaseHomeComponent,
    EntranceEdit,
    entranceManagerComponent
  ],
  imports: [
    UploadModule,
    ReactiveFormsModule,
    DiseaseCenterRoutingModule,
    DiseaseCenterMaterialModule
  ],
  entryComponents: [
    EntranceEdit
  ],
  providers: [EntranceService, EntranceEditService]
})
export class DiseaseCenterModule { }
