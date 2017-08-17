import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import { HttpInterceptorService } from './httpInterceptor.service';
import { UtilService } from 'common/services';
import { IDiseaseCenterEntranceData, IDiseaseCenterServiceData } from 'root/src/interfaces'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

export interface IEntranceData{
  pageNo: number,
  pageSize: number
}

@Injectable()
export class DiseaseHomeService{
  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private http: HttpInterceptorService,
    private utilService: UtilService
  ) { }
  /*-------- 专家专科渠道配置 start -------*/
  getChannelsData(): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/channel/queryAll`
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('获取渠道配置信息失败'))
  }

  createChannelsData(value: string): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/channel/save`
    const _postBody: any = this.utilService.filterFalsy({ name: value })
    return this.http.post(url, _postBody)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('新增失败'))
  }

  deleteChannelsData(id: number): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/channel/delete`
    return this.http.post(url, { id })
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('删除失败'));
  }
  /*-------- 专家专科渠道配置 end -------*/

  /*-------- 专家专科页面入口配置 start -------*/
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
      .catch((err: any) => Observable.throw('新增失败'));
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
  /*-------- 专家专科页面入口配置 end -------*/

  /*-------- 公共服务配置 start -------*/
  getServiceData(): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/config/serve/query`
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('获取疾病中心服务配置失败'))
  }

  createServiceData(postBody: IDiseaseCenterServiceData): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/config/serve/saveOrUpdate`
    const _postBody: any = this.utilService.filterFalsy(postBody)
    return this.http.post(url, _postBody)
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('新增失败'));
  }

  saveServiceData(postBody: IDiseaseCenterServiceData): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/config/serve/saveOrUpdate`
    const _postBody: any = this.utilService.filterFalsy(postBody)
    return this.http.post(url, _postBody)
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('保存失败'));
  }

  deleteServiceData(id: number): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/config/delete`

    return this.http.post(url, { objectId: id, configKey: 'SERVE' })
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('删除失败'));
  }
  /*-------- 公共服务配置 end -------*/

  /*-------- 运营推荐标签配置 start -------*/
  getLabelData(): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/label/queryAll`
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('获取运营推荐标签配置信息失败'))
  }

  createLabelData(value: string): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/label/save`
    const _postBody: any = this.utilService.filterFalsy({ name: value })
    return this.http.post(url, _postBody)
      .map((res: Response) => res.json())
      .catch(() => Observable.throw('新增失败'))
  }

  deleteLabelData(id: number): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/label/invalidate`
    return this.http.post(url, { id })
      .map((res: any) => res.json())
      .catch((err: any) => Observable.throw('删除失败'));
  }

  updateSortFactor({ id, sortFactor = null }: { id: number, sortFactor?: number }): Observable<any> {
    const url: string = `${this.appConfig.api}/disease/center/label/updateSortFactor`
    return this.http.post(url, { labelSortFactorParamList: [{ id, sortFactor: sortFactor && +sortFactor || null }] })
  }
  /*-------- 运营推荐标签配置 end -------*/

}
