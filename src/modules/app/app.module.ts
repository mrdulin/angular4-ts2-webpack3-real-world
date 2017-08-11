import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Http, RequestOptions, HttpModule, XHRBackend } from '@angular/http';
import { httpFactory } from './http-factory';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';

import { APP_CONFIG, AppConfig } from './app.config';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar';
import { ContentComponent } from './content';
import { BreadcrumbComponent } from 'common/components/breadcrumb';
import { ComfirmDialogComponent, ComfirmDialogService } from 'common/components/dialog';

import { StringService, NavigationService, PaginatorService, UploadService, UtilService } from 'common/services';

import { DeptService, HttpInterceptorService, UserService } from 'root/src/services';

import { MdSnackBar } from '@angular/material';
import { Pluck } from 'common/pipes';

import './style.async.css';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ComfirmDialogComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,

    AppRoutingModule
  ],
  entryComponents: [ComfirmDialogComponent],
  bootstrap: [AppComponent],
  providers: [
    Pluck,
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: HttpInterceptorService, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, MdSnackBar] },
    StringService,
    NavigationService,
    PaginatorService,
    DeptService,
    UserService,
    UploadService,
    UtilService,
    ComfirmDialogService
  ]
}
)
export class AppModule {

}
