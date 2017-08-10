import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import { HttpInterceptorService } from './httpInterceptor.service';
import { UtilService } from 'common/services';
import { IDiseaseCenterEntranceData } from 'root/src/models'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

export interface IEntranceData{ 
  pageNo: number, 
  pageSize: number 
}

@Injectable()
export class EntranceService{
  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService,
    private utilService: UtilService
  ) { }

  getChannelsData(): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/channel/queryAll`

    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('获取渠道配置信息失败'))
  }

  getEntranceData({ pageNo = 1, pageSize = 10 }: IEntranceData): Observable<any> {
    const params: URLSearchParams = new URLSearchParams()
    const requestOptions: RequestOptions = new RequestOptions()
    const url: string = `${this.appConfig.api}/disease/center/pageQuery`

    params.set('pageNo', pageNo.toString())
    params.set('pageSize', pageSize.toString())

    requestOptions.params = params
    
    return this.http.get(url, requestOptions)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('获取疾病中心入口配置失败'))
  }

  createEntranceData(postBody: IDiseaseCenterEntranceData): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/save`
    const _postBody: any = this.utilService.filterFalsy(postBody)
    return this.http.post(url, _postBody)
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('保存失败'));
  }

  saveEntranceData(postBody: IDiseaseCenterEntranceData): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/update`
    const _postBody: any = this.utilService.filterFalsy(postBody)

    return this.http.post(url, _postBody)
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('保存失败'));
  }

  deleteEntranceData(id: number): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/invalidate`

    return this.http.post(url, { id })
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('删除失败'));
  }
}
