import { Injectable } from '@angular/core';
import { Request, Response, RequestOptionsArgs, ConnectionBackend, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TipDialogComponent } from 'common/components/dialog';

const GLOBAL_ERROR: Map<string, string> = new Map<string, string>([
  ['-103', '无效的登录状态']
])

@Injectable()
export class HttpInterceptorService extends Http {
  dialogRef: MdDialogRef<TipDialogComponent>;

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private dialog: MdDialog) {
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
    if (options == null) {
      options = new RequestOptions({
        'withCredentials': true
      });
    }

    options.withCredentials = true;
    // options.headers.append('Content-Type', 'application/json');
    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.map((res: any) => {
      const data = res.json();
      if (data.hasError) {
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

        this.dialogRef = this.dialog.open(TipDialogComponent, {
          data: {
            msg: GLOBAL_ERROR.get(err.errorCode.toString())
          }
        });
      } else if (err.status < 200 || err.status >= 300) {
        //TODO: http status error
      }

      return Observable.throw(err);
    })
    .finally(() => {
      this.dialogRef && this.dialogRef.close();
    });
  }
}
