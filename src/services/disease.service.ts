import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';
import { HttpInterceptorService } from './httpInterceptor.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import * as diseases from './diseases.json';

@Injectable()
export class DiseaseService {

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private _http: HttpInterceptorService
  ) { }

  getDiseasesByPage(name: string = '测试', page: number, pageSize: number = 10): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    const requestOptions: RequestOptions = new RequestOptions();

    params.set('tagName', name);
    params.set('pageNo', page.toString());
    params.set('pageSize', pageSize.toString());

    requestOptions.params = params;

    const url: string = `${this.appConfig.api}/tag/disease/pageQuery`;

    // if (this.appConfig.mockApi) {
    //   return Observable.of(diseases);
    // }

    return this._http.get(url, requestOptions)
      .map((res: Response) => res.json())
      .catch((err: any) => {
        return Observable.throw(err);
      })

  }
}
