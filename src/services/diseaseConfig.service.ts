import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import * as data from './diseaseConfig.json';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DiseaseConfigService {
  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) { }

  getConfigByTagId(id: number | string): Observable<any> {
    const url: string = `${this.appConfig.api}/tag/disease/config?tagId=${id}`;
    if(this.appConfig.mockApi) {
      return Observable.of((<any>data).model);
    }
    return this.http.get(url).map((res: any) => {
      const data: any = res.json();
      return data.model;
    }).catch((e: any)=> {
      console.error(e);
      return Observable.throw(e)
    });
  }
}
