import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';

import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
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
    private http: HttpInterceptorService
  ) { }

  getDeptsByTagLevel(lv: number | string): void {
    const url: string = `${this.appConfig.api}/tag/dept/child?tagLevel=${lv}`;
    if (this.appConfig.mockApi) {
      this.deptsLevel1 = (<any>data).model;
      return;
    }
    this.http.get(url)
      .map((res: Response) => res.json())
      .catch((e: any) => Observable.throw(e))
      .subscribe((data) => {
        this.deptsLevel1 = data.model;
      });
  }

  getDeptsByTagId(id: number | string) {
    const url: string = `${this.appConfig.api}/tag/dept/child?tagId=${id}`;

    return this.http.get(url)
      .map((res: Response) => res.json())
      .map((data: any) => data.model)
      .catch((e: any) => Observable.throw('获取二级科室出错'));
  }

  getDeptsByPage(name: string, page: number, pageSize: number = 10): void {
    const url: string = `${this.appConfig.api}/tag/dept/pageQuery?tagName=${name}&pageNo=${page}&pageSize=${pageSize}`;
    if (this.appConfig.mockApi) {
      setTimeout(() => {
        const { model: { count, t } } = <any>getDeptsByPageResponse;
        this.count = count;
        this.dataChange.next(t);
      }, 1000);
    }
    this.http.get(url)
      .map((res: Response) => res.json())
      .map((data: any) => {
        this.dataChange.next(data);
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  getDeptsData(): any[] {
    return this.dataChange.value;
  }

  addDept(dept: any): Observable<any> {
    const url: string = `${this.appConfig.api}/tag/dept/save`;

    if (this.appConfig.mockApi) {
      if ((<any>addDeptSuccessResponse).success) {
        dept.tagId = (<any>addDeptSuccessResponse).model;
        const depts: any[] = this.getDeptsData();
        if (depts.length > 0) {
          this.count += 1;
          const newDepts = [dept, ...depts];
          this.dataChange.next(newDepts);
        }
      }
      return Observable.of(addDeptSuccessResponse);
    }

    return this.http.post(url, dept)
      .map((res: Response) => res.json())
      .catch((err: any) => {
        console.error(err);
        return Observable.throw(err);
      });
  }
}
