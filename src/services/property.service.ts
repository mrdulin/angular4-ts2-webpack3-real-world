import { Injectable, Inject } from '@angular/core';
import { HttpInterceptorService } from './httpInterceptor.service';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import { Response } from '@angular/http';

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

  getPropertiesByName(name: string, pageNo: number, pageSize: number = 10) {
    let url: string = `${this.appConfig.api}/property/name/pageQuery?propertyName=${name}&pageNo=${pageNo}&pageSize=${pageSize}`;
    url = encodeURI(url);

    if (this.appConfig.mockApi) {
      this.dataChange.next((<any>getPropertiesResponse).model);
    }

    this.http.get(url)
      .map((res: Response) => res.json())
      .map((data) => {
        this.dataChange.next(data);
      })
      .catch((err: any) => {
        return Observable.throw(err);
      });
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
      .catch((err: any) => {
        return Observable.throw(err);
      })
  }
}
