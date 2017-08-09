import { Injectable, Inject } from '@angular/core';
import { HttpInterceptorService } from './httpInterceptor.service';

import { APP_CONFIG, IAppConfig } from '../modules/app/app.config';

import { Observable } from 'rxjs';

export interface IUserApi {
  admin: boolean;
  deleted: boolean;
  id: number;
  merchantId: number;
  name: string;
  staffStatus: string;
  vendorId: number;
  version: number;
}

@Injectable()
export class UserService {
  user: IUserApi;

  constructor(
    private http: HttpInterceptorService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) {
  }

  getUser(): Observable<IUserApi> {
    const url: string = `${this.appConfig.LOGIN_HOST}/login/staff/info`;

    if (this.user) {
      return Observable.of(this.user);
    }

    return this.http.get(url)
      .map(res => res.json())
      .map((data: IUserApi) => {
        this.user = data;
        return data;
      })
      // .catch((err: any) => Observable.throw(err));
  }

  logout() {
    const returnUrl: string = encodeURI(window.location.href);
    const loginUrl: string = `${this.appConfig.LOGIN_HOST}/login/logout?appId=${this.appConfig.APP_ID}&returnUrl=${returnUrl}`;
    window.location.href = loginUrl;
  }

  login() {
    this.logout();
  }
}
