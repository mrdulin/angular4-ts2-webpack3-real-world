import { Injectable, Inject } from '@angular/core';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';
import { MdSnackBar } from '@angular/material';

import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import { GLOBAL_ERROR } from 'app/error.config';
import { HttpInterceptorService } from './httpInterceptor.service';

import * as data from './deptsLevel1.json';
import * as getDeptsByPageResponse from './depts.json';
import * as addDeptSuccessResponse from './addDeptSuccess.json';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class DeptService {
  deptsLevel1: any[] = [];

  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  count: number;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService,
    private snackBar: MdSnackBar
  ) { }

  /**
   * 根据科室等级获取科室
   *
   * @param {(number | string)} lv
   * @returns {void}
   * @memberof DeptService
   */
  getDeptsByTagLevel(lv: number | string): void {
    const url: string = `${this.appConfig.api}/tag/dept/child?tagLevel=${lv}`;

    if (this.appConfig.mockApi) {
      this.deptsLevel1 = (<any>data).model;
      return;
    }

    this.http.get(url)
      .map((res: Response) => res.json())
      .catch((e: any) => Observable.throw('获取一级科室失败'))
      .subscribe(
        (data) => this.deptsLevel1 = data.model,
        (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
      );
  }

  /**
   * 根据科室id获取子科室
   *
   * @param {(number | string)} id
   * @returns
   * @memberof DeptService
   */
  getDeptsByTagId(id: number | string) {
    const url: string = `${this.appConfig.api}/tag/dept/child?tagId=${id}`;

    return this.http.get(url)
      .map((res: Response) => res.json())
      .map((data: any) => data.model)
      .catch(() => Observable.throw('获取二级科室出错'));
  }

  /**
   * 根据科室名称获取科室
   *
   * @param {string} name
   * @param {number} page
   * @param {number} [pageSize=10]
   * @memberof DeptService
   */
  getDeptsByPage(name: string, page: number, pageSize: number = 10): void {
    const params: URLSearchParams = new URLSearchParams();
    const requestOptions: RequestOptions = new RequestOptions();
    const url: string = `${this.appConfig.api}/tag/dept/pageQuery`;

    params.set('pageNo', page.toString());
    params.set('pageSize', pageSize.toString());

    if (name) {
      params.set('tagName', name);
    }
    requestOptions.params = params;

    if (this.appConfig.mockApi) {
      setTimeout(() => {
        const { model: { count, t } } = <any>getDeptsByPageResponse;
        this.count = count;
        this.dataChange.next(t);
      }, 1000);
    }

    this.http.get(url, requestOptions)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw('获取科室列表失败'))
      .subscribe((data: any) => {
        const { model: { count, t: depts } } = data;
        this.count = count;
        this.dataChange.next(depts);
      }, (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig))
  }

  getDeptsData(): any[] {
    return this.dataChange.value;
  }

  /**
   * 新增科室
   *
   * @param {*} dept
   * @returns {Observable<any>}
   * @memberof DeptService
   */
  addDept(dept: any): Observable<any> {
    const url: string = `${this.appConfig.api}/tag/dept/save`;

    if (this.appConfig.mockApi) {
      if ((<any>addDeptSuccessResponse).success) {
        dept.tagId = (<any>addDeptSuccessResponse).model;
        const depts: any[] = this.getDeptsData();
        if (depts.length > 0) {
          this.count += 1;
          this.dataChange.next([dept, ...depts]);
        }
      }
      return Observable.of(addDeptSuccessResponse);
    }

    return this.http.post(url, dept)
      .map((res: Response) => {
        const data: any = res.json();

        dept.tagId = data.tagId;
        const depts: any[] = this.getDeptsData();
        if (depts.length > 0) {
          this.count += 1;
          this.dataChange.next([dept, ...depts]);
        }
        return data;
      })
      .catch((data: any) => {
        const msg: string = GLOBAL_ERROR.get(data.errorCode.toString()) || '新增科室失败';
        return Observable.throw(msg);
      });
  }

  /**
   * 保存科室信息修改
   *
   * @param {*} postBody
   * @returns
   * @memberof DeptService
   */
  save(postBody: any) {
    const url: string = `${this.appConfig.api}/tag/dept/save`;
    return this.http.post(url, postBody).map((res: Response) => res.json()).catch(() => Observable.throw('保存科室信息失败'));
  }
}
