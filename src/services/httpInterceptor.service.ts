import { Injectable } from '@angular/core';
import { Request, Response, RequestOptionsArgs, ConnectionBackend, RequestOptions, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { MdSnackBar, MdSnackBarRef, SimpleSnackBar } from '@angular/material';

import { IAppConfig } from 'app/app.config';
import { GLOBAL_ERROR } from '../modules/app/error.config';

@Injectable()
export class HttpInterceptorService extends Http {

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private snackBar: MdSnackBar
  ) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    const _options = this.getRequestOptionArgs(options);
    _options.headers.set('Content-Type', 'application/json');
    return this.intercept(super.post(url, body, _options));
  }

  options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.options(url, this.getRequestOptionArgs(options)));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      options = new RequestOptions({
        withCredentials: true
      });
    }
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.withCredentials = true;
    options.headers.set('Accept', 'application/json');

    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.map((res: any) => {
      if (res.text() === 'need cookie: _tk') {
        const err = { hasError: true, errorCode: -103 };
        throw err;
      };
      const data = res.json();
      if (data.hasError || data.errorCode) {
        throw data;
      } else {
        return res;
      }
    })
      .catch((err, source) => {
        if (err.gwError) {
          //TODO: gateway error
        } else if (err.hasError) {
          //TODO: api error
          if (err.errorCode.toString() === '-103') {
            const msg: string = GLOBAL_ERROR.get(err.errorCode.toString());
            this.snackBar && this.snackBar.dismiss();
            this.snackBar.open(msg, null, { duration: 2000 });
          }
        } else if (err.status < 200 || err.status >= 300) {
          //TODO: http status error
          const snackBarRef: MdSnackBarRef<SimpleSnackBar> = this.snackBar.open('http请求异常', '刷新');
          snackBarRef.onAction().subscribe(() => {
            window.location.reload();
          });
        }

        return Observable.throw(err);
      });
  }
}
