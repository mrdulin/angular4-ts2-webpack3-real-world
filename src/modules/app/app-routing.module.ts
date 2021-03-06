import { Routes, RouterModule, Router } from '@angular/router';
import { NgModule, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar';
import { ContentComponent } from './content';

import { loadTagManagerModule } from '../tagManager';
import { loadGoToHospitalModule } from '../goToHospital';
import { RouterService } from 'common/services';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tag-manager',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentComponent,
    children: [
      // -- 异步加载的特性模块 --
      {
        path: '',
        loadChildren: '../tagManager/tm.module#TagManagerModule?chunkName=tagManagerModule&sync=true'
      },
      {
        path: '',
        loadChildren: '../goToHospital/goToHospital.module#GoToHospitalModule?chunkName=goToHospitalModule'
      },

      {
        path: '',
        loadChildren: '../diseaseCenter/diseaseCenter.module#DiseaseCenterModule?chunkName=diseaseCenter'
      },
      {
        path: '',
        loadChildren: '../doctorCenter/doctorCenter.module#DoctorCenterModule?chunkName=doctorCenter'
      }
      //--
    ]
  },
  {
    path: '',
    outlet: 'sidebar',
    component: SidebarComponent
  },
  {
    path: '**',
    redirectTo: 'tag-manager',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: [RouterService]
})
export class AppRoutingModule {
  // constructor(
  //   private _router: Router,
  //   private _routerService: RouterService
  // ) {
    // this.loadAsyncRoutes();
  // }

  // private loadAsyncRoutes() {
  //   const asyncRoutes: any[] = this._routerService.loadAsyncRoutes((<any>config).mods);
  //   asyncRoutes.forEach((route: any) => {
  //     routes[1].children.push(route);
  //   });
  //   this._router.resetConfig(routes);
  //   console.log(this._router.config);
  // }

}
