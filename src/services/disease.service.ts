import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import * as diseases from './diseases.json';

@Injectable()
export class DiseaseService {

  constructor(
    private _http: Http
  ) { }

  getDiseasesByPage(q: string, page: number) {
    return Observable.of(diseases);
  }

  handleError(e: any): any {
    console.log(e);
  }
}
