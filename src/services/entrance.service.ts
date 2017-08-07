import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import * as data from './entrance.json';

import { HttpInterceptorService } from './httpInterceptor.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class EntranceService{
  constructor(
    private http: HttpInterceptorService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) { }

  getEntranceData(): any {
    if (this.appConfig.mockApi) {
      return data
    }
    return data
  }
}
