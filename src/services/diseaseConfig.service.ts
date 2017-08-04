import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import * as data from './diseaseConfig.json';
import * as saveDiseaseConfigResponse from './saveDiseaseConfig.json';

import { IDiseaseMainInfo, IDiseaseConfig } from 'root/src/models';
import { HttpInterceptorService } from './httpInterceptor.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DiseaseConfigService {
  constructor(
    private http: HttpInterceptorService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) { }

  getByTagId(id: number | string): Observable<any> {
    const url: string = `${this.appConfig.api}/tag/disease/config?tagId=${id}`;
    if (this.appConfig.mockApi) {
      return Observable.of((<any>data).model);
    }
    return this.http.get(url).map((res: Response) => {
      const data: any = res.json();
      return data.model;
    }).catch((e: any) => {
      console.error(e);
      return Observable.throw(e);
    });
  }

  save(diseaseInfo: IDiseaseMainInfo & IDiseaseConfig) {
    const url: string = `${this.appConfig.api}/tag/disease/save/config`;
    if (this.appConfig.mockApi) {
      return Observable.of(saveDiseaseConfigResponse);
    }
    return this.http.post(url, diseaseInfo).map((res: Response) => res.json());
  }
}
