import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import { HttpInterceptorService } from './httpInterceptor.service';
import { UtilService } from 'common/services';
import {
  IDiseaseConfig,
  IApiResponse,
  IDiseaseTagName,
  IDiseaseSavePostBody,
  IDiseaseTagWithChildren,
  IDisease,
  IPagination
} from 'root/src/interfaces';

import * as data from './diseaseConfig.json';
import * as saveDiseaseConfigResponse from './saveDiseaseConfig.json';
import * as diseases from './diseases.json';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';


export interface IGetDiseasesByPageData {
  type: string;
  value: string;
}

@Injectable()
export class DiseaseService {

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService,
    private utilService: UtilService
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

    if (data.value) {
      switch (data.type) {
        case 'diseaseName':
          params.set('tagName', data.value);
          break;
        case 'ICD':
          params.set('standardCode', data.value);
          break;
      }
    }

    params.set('pageNo', page.toString());
    params.set('pageSize', pageSize.toString());

    requestOptions.params = params;

    if (this.appConfig.mockApi) {
      return Observable.of(diseases);
    }

    return this.http.get(url, requestOptions)
      .map((res: Response) => res.json())
      .map((apiRes: IApiResponse<IDisease<IDiseaseTagWithChildren>[], IPagination>) => apiRes.model)
      .catch(() => Observable.throw('获取疾病列表失败'));
  }

  /**
   * 根据疾病tagId获取疾病配置信息
   *
   * @param {(number | string)} id
   * @returns {Observable<any>}
   * @memberof DiseaseService
   */
  getByTagId(id: number | string): Observable<IDiseaseConfig> {
    const url: string = `${this.appConfig.api}/tag/disease/config?tagId=${id}`;

    if (this.appConfig.mockApi) {
      return Observable.of((<any>data).model);
    }

    return this.http.get(url)
      .map((res: Response): IApiResponse<IDiseaseConfig> => res.json())
      .map((data: IApiResponse<IDiseaseConfig>) => data.model)
      .catch(() => Observable.throw('获取疾病配置信息失败'));
  }

  /**
   *
   * 标准疾病管理
   *
   * 疾病编辑配置保存
   * @param {(IDiseaseTagName & IDiseaseConfig)} diseaseInfo
   * @returns
   * @memberof DiseaseService
   */
  saveConfig(diseaseInfo: IDiseaseTagName & IDiseaseConfig) {
    const url: string = `${this.appConfig.api}/tag/disease/save/config`;
    if (this.appConfig.mockApi) {
      return Observable.of(saveDiseaseConfigResponse);
    }
    return this.http.post(url, diseaseInfo)
      .map((res: Response): IApiResponse<boolean> => res.json())
      .catch(() => Observable.throw('保存失败'));
  }

  /**
   * 保存疾病信息
   *
   * @param {IDiseaseSavePostBody} postBody
   * @returns
   * @memberof DiseaseService
   */
  save(postBody: IDiseaseSavePostBody) {
    const url: string = `${this.appConfig.api}/tag/disease/save`;

    const _postBody: IDiseaseSavePostBody = this.utilService.filterFalsy(postBody);
    if (!_postBody.relatedTags.length) {
      delete _postBody.relatedTags;
    }
    return this.http.post(url, _postBody)
      .map((res: Response): IApiResponse<number> => res.json())
      .catch((apiRes: IApiResponse<number>) => Observable.throw('保存失败'));
  }
}
