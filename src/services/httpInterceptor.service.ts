import { Injectable } from '@angular/core';
import { Request, Response, RequestOptionsArgs, ConnectionBackend, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DialogComponent } from 'common/components/dialog';

const GLOBAL_ERROR: Map<string, string> = new Map<string, string>([
  ['-103', '无效的登录状态']
])

@Injectable()
export class HttpInterceptorService extends Http {
  dialogRef: MdDialogRef<DialogComponent>;

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private dialog: MdDialog) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, options));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, this.getRequestOptionArgs(options)));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    // if (options == null) {
    //   options = new RequestOptions();
    // }
    // options.headers.append('Content-Type', 'application/json');
    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    console.log('intercept')
    return observable.map((res: any) => {
      const data = res.json();
      if (data.hasError) {
        throw data;
      } else {
        return res;
      }
    }).catch((err, source) => {
      if(err.gwError) {
        //TODO: 网关错误
      } else if (err.hasError) {
        //TODO: api接口错误

        //TODO: 通用模态框没有正确显示传过去的文案信息
        // this.dialogRef && this.dialogRef.close();
        // this.dialogRef = this.dialog.open(DialogComponent, {
        //   data: {
        //     msg: GLOBAL_ERROR.get(err.errorCode.toString())
        //   }
        // });
        alert(GLOBAL_ERROR.get(err.errorCode.toString()));
      } else if (err.status < 200 || err.status >= 300) {
        //TODO: http状态码错误
      }

      return Observable.throw(err);
    });
  }
}
