import { Injectable, Inject } from '@angular/core';
import { HttpInterceptorService } from './httpInterceptor.service';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as getPropertiesResponse from './getPropertiesResponse.json';
import * as propertySaveSuccessRes from './propertySaveSuccessRes.json';

@Injectable()
export class PropertySerivce {

  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService
  ) { }

  /**
   * 根据类别关键字获取属性项
   *
   * @param {string} name
   * @param {number} pageNo
   * @param {number} [pageSize=10]
   * @memberof PropertySerivce
   */
  getPropertiesByName(name: string, pageNo: number, pageSize: number = 10) {
    const params: URLSearchParams = new URLSearchParams();
    const requestOptions: RequestOptions = new RequestOptions();

    let url: string = `${this.appConfig.api}/property/name/pageQuery`;

    params.set('propertyName', name);
    params.set('pageNo', pageNo.toString());
    params.set('pageSize', pageSize.toString());
    requestOptions.params = params;

    if (this.appConfig.mockApi) {
      this.dataChange.next((<any>getPropertiesResponse).model);
    }

    return this.http.get(url, requestOptions)
      .map((res: Response) => res.json().model)
      .map((data: any) => {
        this.dataChange.next(data);
        return data;
      })
      .catch(() => Observable.throw('获取属性项列表失败'))
  }

  /**
   *
   * 保存编辑的属性
   * @param {*} data
   * @returns {Observable<any>}
   * @memberof PropertySerivce
   */
  save(data: any): Observable<any> {
    const url: string = `${this.appConfig.api}/property/save`;

    if (this.appConfig.mockApi) {
      return Observable.of(propertySaveSuccessRes);
    }

    return this.http.post(url, data)
      .map((res) => res.json())
      .catch(() => Observable.throw('编辑失败'));
  }
}
