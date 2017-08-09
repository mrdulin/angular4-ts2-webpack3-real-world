import { Injectable } from '@angular/core';
import { Request, Response, RequestOptionsArgs, ConnectionBackend, RequestOptions, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { MdSnackBar, MdSnackBarRef, SimpleSnackBar } from '@angular/material';

const GLOBAL_ERROR: Map<string, string> = new Map<string, string>([
  ['-103', '无效的登录状态']
])

@Injectable()
export class HttpInterceptorService extends Http {
  snackBarRef: MdSnackBarRef<SimpleSnackBar>;

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private snackBar: MdSnackBar) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
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
    // options.headers.append('Content-Type', 'application/json');
    options.headers.set('Accept', 'application/json');

    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.map((res: any) => {
      if (res.text() === 'need cookie: _tk') {
        const err = { hasError: true, errorCode: '-103' };
        throw err;
      };
      const data = res.json();
      if (data.hasError || !data.success) {
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
          if (err.errorCode === -103) {
            const msg: string = GLOBAL_ERROR.get(err.errorCode.toString());
            this.snackBarRef = this.snackBar.open(msg, null, { duration: 2000 });
          }
        } else if (err.status < 200 || err.status >= 300) {
          //TODO: http status error
        }

        return Observable.throw(err);
      });
  }
}
