import { Injectable, Inject } from '@angular/core';
import { HttpInterceptorService } from './httpInterceptor.service';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as getPropertiesResponse from './getPropertiesResponse.json';
import * as propertySaveSuccessRes from './propertySaveSuccessRes.json';

type ISaveType = 'edit-prop' | 'add-prop-val' | 'del-prop-val';

export interface IQueryCondition{
  keyword: string;
  pageIndex: number;
}

@Injectable()
export class PropertySerivce {

  public static choiceMap: Map<string, string> = new Map<string, string>([
    ['1', '单选'],
    ['2', '多选']
  ]);

  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private currentEditProperty: any;
  private condition: IQueryCondition;
  private saveErrorMap: Map<string, string> = new Map([
    ['edit-prop', '编辑失败'],
    ['del-prop-val', '删除属性值失败'],
    ['add-prop-val', '添加属性值失败']
  ]);

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

  getChildPropertiesById(id: number | string): Observable<any> {
    const url: string = `${this.appConfig.api}/property/child?propertyId=${id}`;
    return this.http.get(url).map((res: Response) => res.json()).catch(() => Observable.throw('获取子属性项失败'));
  }

  /**
   *
   * 保存属性项编辑
   *
   * @param {*} data
   * @returns {Observable<any>}
   * @memberof PropertySerivce
   */
  save(data: any, type: ISaveType): Observable<any> {
    const url: string = `${this.appConfig.api}/property/save`;
    const errMsg: string = this.saveErrorMap.get(type);

    if (this.appConfig.mockApi) {
      return Observable.of(propertySaveSuccessRes);
    }

    return this.http.post(url, data)
      .map((res) => res.json())
      .catch(() => Observable.throw(errMsg));
  }

  saveSubProperty(postBody: any) {
    const url: string = `${this.appConfig.api}/property/sub/save`;
    return this.http.post(url, JSON.stringify(postBody)).map((res: Response) => res.json()).catch(() => Observable.throw('新增子属性项失败'));
  }

  setCurrentEditProperty(property: any) {
    this.currentEditProperty = property;
  }

  getCurrentEditProperty() {
    return this.currentEditProperty;
  }

  // saveQueryCondition(condition: IQueryCondition) {
  //   this.condition = condition;
  // }

  // getQueryCondition() {
  //   return this.condition;
  // }
}
