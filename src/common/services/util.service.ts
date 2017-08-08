import { Injectable } from '@angular/core';

@Injectable()
export class UtilService{

  copy(data: any, deep: boolean = true) {
    return JSON.parse(JSON.stringify(data));
  }
}
