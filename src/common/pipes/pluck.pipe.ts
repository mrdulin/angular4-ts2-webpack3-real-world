import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluck'
})
export class Pluck implements PipeTransform {
  transform(datas: any, key: string): string | void {
    if (datas) {
      return datas.map((data: any) => {
        return data[key];
      });
    }
  }
}
