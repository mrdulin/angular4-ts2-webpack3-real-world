import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DiseaseHomeComponent } from './diseaseHome';

const routes: Routes = [
  {
    path: 'disease-center',
    data: {
      name: '专家专科业务'
    },
    children: [
      {
        path: '',
        redirectTo: 'disease-home',
        pathMatch: 'full'
      },
      {
        path: 'disease-home',
        component: DiseaseHomeComponent,
        data: {
          name: '聚合页配置'
        }
      },
      {
        path: 'specialist-home',
        component: DiseaseHomeComponent,
        data: {
          name: '专家专科页配置'
        }
      },
      {
        path: 'hospital-home',
        component: DiseaseHomeComponent,
        data: {
          name: '医院配置'
        }
      },
      {
        path: 'doctor-home',
        component: DiseaseHomeComponent,
        data: {
          name: '医生配置'
        }
      },
      {
        path: 'serve-city',
        component: DiseaseHomeComponent,
        data: {
          name: '服务城市配置'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DiseaseCenterRoutingModule { }
