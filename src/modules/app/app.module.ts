import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';

import { APP_CONFIG, AppConfig } from './app.config';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar';
import { ContentComponent } from './content';
import { BreadcrumbComponent } from 'common/components/breadcrumb';

import { StringService, NavigationService, PaginatorService } from 'common/services';
import { DeptService } from '../../services';

import './style.async.css';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    SidebarComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,

    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    StringService,
    NavigationService,
    PaginatorService,
    DeptService
  ]
}
)
export class AppModule {

}
