import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import * as data from './deptsLevel1.json';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DeptService {
  deptsLevel1: any[] = [];

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: Http
  ) { }

  getDeptsByTagLevel(lv: number | string): void {
    const url: string = `${this.appConfig.api}/tag/dept/child?tagLevel=${lv}`;
    if (this.appConfig.mockApi) {
      this.deptsLevel1 = (<any>data).model;
    }
    this.http.get(url).map(this.getDeptsByTagLevelSuccess).catch(this.getDeptsByTagLevelError);
  }

  getDeptsByTagLevelSuccess(res: any) {
    const data: any = res.json();
    this.deptsLevel1 = data.model;
    return this.deptsLevel1;
  }

  getDeptsByTagLevelError(e: any): any {
    console.log(e);
  }
}
