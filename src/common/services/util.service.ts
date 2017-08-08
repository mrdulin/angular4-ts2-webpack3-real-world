import { Injectable } from '@angular/core';

@Injectable()
export class UtilService{

  copy(data: any, deep: boolean = true) {
    return JSON.parse(JSON.stringify(data));
  }

  filterFalsy(obj: any) {
    const _obj: any = {};
    Object.keys(obj).map((key: string) => {
      if(obj[key]) {
        return key;
      }
      return null;
    }).filter(x => x).forEach((key: string) => {
      _obj[key] = obj[key];
    });
    return _obj;
  }
}
