import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { UploadModule, UploadComponent } from '../../common/components/upload';
import { CheckboxGroupComponent } from '../../common/components/checkboxGroup';
import { DiseaseHomeComponent } from './diseaseHome';
import { EntranceManagerComponent, EntranceEditComponent } from './diseaseHome/entranceManager';
import { ChannelsManagerComponent } from './diseaseHome/channelsManager';
import { ServiceManagerComponent, ServiceEditComponent } from './diseaseHome/serviceManager';
import { LabelManagerComponent, LabelEditComponent } from './diseaseHome/labelManager';

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
    LabelManagerComponent,
    LabelEditComponent
  ],
  imports: [
    UploadModule,
    ReactiveFormsModule,
    DiseaseCenterRoutingModule,
    DiseaseCenterMaterialModule
  ],
  entryComponents: [
    EntranceEditComponent,
    ServiceEditComponent,
    LabelEditComponent
  ],
  providers: [DiseaseHomeService]
})
export class DiseaseCenterModule { }

export function loadDiseaseCenterModule() {
  return DiseaseCenterModule;
}
