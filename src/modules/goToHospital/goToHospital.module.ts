import { NgModule } from '@angular/core'
import { GoToHospitalMaterialModule } from './goToHospital-material.module'

import { GoToHospitalRoutingModule } from './goToHospital-routing.module'
import { HomePageComponent } from './homePage'

@NgModule({
  imports: [
    GoToHospitalMaterialModule,
    GoToHospitalRoutingModule
  ],
  declarations: [
    HomePageComponent
  ],
  providers: []
  // exports: []
})
export class GoToHospitalModule { }

export function loadGoToHospitalModule() {
  return GoToHospitalModule;
};
