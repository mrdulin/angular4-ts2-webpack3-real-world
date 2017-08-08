import { RequestOptions, XHRBackend } from '@angular/http';
import { HttpInterceptorService } from 'root/src/services';
import { MdSnackBar } from '@angular/material';

export function httpFactory(
  xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  snackBar: MdSnackBar): HttpInterceptorService {
  return new HttpInterceptorService(xhrBackend, requestOptions, snackBar);
}
