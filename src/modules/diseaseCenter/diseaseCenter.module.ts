import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { UploadModule } from '../../common/components/upload';
import { UploadComponent } from '../../common/components/upload/upload.component';
import { CheckboxGroupComponent } from '../../common/components/checkboxGroup';
import { DiseaseHomeComponent } from './diseaseHome';
import { EntranceManagerComponent } from './diseaseHome/entranceManager';
import { EntranceEditComponent } from './diseaseHome/entranceManager/editDialog/editDialog.component';
import { ChannelsManagerComponent } from './diseaseHome/channelsManager';
import { ServiceManagerComponent } from './diseaseHome/serviceManager';
import { ServiceEditComponent } from './diseaseHome/serviceManager/editDialog/editDialog.component';
import { LabelManagerComponent } from './diseaseHome/labelManager';

import { DiseaseCenterRoutingModule } from './diseaseCenter-routing.module';
import { DiseaseCenterMaterialModule } from './diseaseCenter-material.module';

import { DiseaseHomeService } from 'root/src/services'

@NgModule({
  declarations: [
    UploadComponent,
    CheckboxGroupComponent,
    DiseaseHomeComponent,
    EntranceManagerComponent,
    EntranceEditComponent,
    ChannelsManagerComponent,
    ServiceManagerComponent,
    ServiceEditComponent,
    LabelManagerComponent
  ],
  imports: [
    UploadModule,
    ReactiveFormsModule,
    DiseaseCenterRoutingModule,
    DiseaseCenterMaterialModule
  ],
  entryComponents: [
    EntranceEditComponent,
    ServiceEditComponent
  ],
  providers: [DiseaseHomeService]
})
export class DiseaseCenterModule { }

// export function loadDiseaseCenterModule() {
//   return DiseaseCenterModule;
// }
