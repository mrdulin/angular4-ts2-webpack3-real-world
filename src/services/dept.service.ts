import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';

import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import * as data from './deptsLevel1.json';
import * as getDeptsByPageResponse from './depts.json';
import { HttpInterceptorService } from './httpInterceptor.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DeptService {
  deptsLevel1: any[] = [];

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService
  ) { }

  getDeptsByTagLevel(lv: number | string): void {
    const url: string = `${this.appConfig.api}/tag/dept/child?tagLevel=${lv}`;
    if (this.appConfig.mockApi) {
      this.deptsLevel1 = (<any>data).model;
      return;
    }
    this.http.get(url).map((res: Response) => {
      const data: any = res.json();
      this.deptsLevel1 = data.model;
    }).catch((e: any) => {
      console.error(e);
      return Observable.throw(e);
    });
  }

  getDeptsByPage(name: string, page: number, pageSize: number = 10): Observable<any> {
    const url: string = `${this.appConfig.api}/tag/dept/pageQuery?tagName=${name}&pageNo=${page}&pageSize=${pageSize}`;
    if (this.appConfig.mockApi) {
      return Observable.of((<any>getDeptsByPageResponse).model);
    }
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }
}
