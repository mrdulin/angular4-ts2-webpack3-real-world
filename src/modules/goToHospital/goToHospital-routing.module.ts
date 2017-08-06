import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomePageComponent } from './homePage'

const routes: Routes = [
  {
    path: 'go-to-hospital',
    children: [
      {
        path: '',
        redirectTo: 'home-page',
        pathMatch: 'full'
      },
      {
        path: 'home-page',
        component: HomePageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoToHospitalRoutingModule { }
