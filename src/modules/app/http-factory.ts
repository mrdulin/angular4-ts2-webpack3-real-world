import { RequestOptions, XHRBackend } from '@angular/http';
import { HttpInterceptorService } from 'root/src/services';
import { MdDialog } from '@angular/material';

export function httpFactory(
  xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  mdDialog: MdDialog): HttpInterceptorService {
  return new HttpInterceptorService(xhrBackend, requestOptions, mdDialog);
}
