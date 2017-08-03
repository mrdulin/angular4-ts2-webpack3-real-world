import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import * as diseases from '../models/diseases.json';

// const api: string = 'http://it-ebooks-api.info/v1';

@Injectable()
export class SicknessService {

  constructor(
    private _http: Http
  ) { }

  getDiseasesByPage(q: string, page: number) {
    // const url: string = `${api}/search/${q}/page/${page}`;
    // return this._http.get(url).map((res: any) => res.json()).catch(this.handleError);
    return Observable.of(diseases);
  }

  handleError(e: any): any {
    console.log(e);
  }
}
