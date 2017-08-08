import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import { HttpInterceptorService } from './httpInterceptor.service';

import { IDiseaseMainInfo, IDiseaseConfig } from 'root/src/models';
import * as data from './diseaseConfig.json';
import * as saveDiseaseConfigResponse from './saveDiseaseConfig.json';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import * as diseases from './diseases.json';

export interface IGetDiseasesByPageData {
  type: string;
  value: string;
}

@Injectable()
export class DiseaseService {

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService
  ) { }

  /**
   *
   * 标准疾病管理
   *
   * 根据查询类别和关键字，分页查询疾病
   * @param {IGetDiseasesByPageData} data
   * @param {number} page
   * @param {number} [pageSize=10]
   * @returns {Observable<any>}
   * @memberof DiseaseService
   */
  getDiseasesByPage(data: IGetDiseasesByPageData, page: number, pageSize: number = 10): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    const requestOptions: RequestOptions = new RequestOptions();
    const url: string = `${this.appConfig.api}/tag/disease/pageQuery`;

    switch (data.type) {
      case 'diseaseName':
        params.set('tagName', data.value);
        break;
      case 'ICD':
        params.set('standardCode', data.value);
        break;
    }

    params.set('pageNo', page.toString());
    params.set('pageSize', pageSize.toString());

    requestOptions.params = params;

    if (this.appConfig.mockApi) {
      return Observable.of(diseases);
    }

    return this.http.get(url, requestOptions)
      .map((res: Response) => res.json())
      .catch((err: any) => {
        return Observable.throw(err);
      });

  }

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

  /**
   *
   * 标准疾病管理
   *
   * 疾病编辑配置保存
   * @param {(IDiseaseMainInfo & IDiseaseConfig)} diseaseInfo
   * @returns
   * @memberof DiseaseService
   */
  save(diseaseInfo: IDiseaseMainInfo & IDiseaseConfig) {
    const url: string = `${this.appConfig.api}/tag/disease/save/config`;
    if (this.appConfig.mockApi) {
      return Observable.of(saveDiseaseConfigResponse);
    }
    return this.http.post(url, diseaseInfo)
      .map((res: Response) => res.json())
      .catch((err: any) => {
        console.error(err);
        return Observable.throw(err);
      });
  }
}
