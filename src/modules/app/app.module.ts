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
import { TipDialogComponent } from 'common/components/dialog';

import { StringService, NavigationService, PaginatorService } from 'common/services';
import { DeptService, HttpInterceptorService } from 'root/src/services';
import { MdDialog } from '@angular/material';

import './style.async.css';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    SidebarComponent,
    BreadcrumbComponent,
    TipDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,

    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TipDialogComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: HttpInterceptorService, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, MdDialog] },
    StringService,
    NavigationService,
    PaginatorService,
    DeptService,
  ]
}
)
export class AppModule {

}
