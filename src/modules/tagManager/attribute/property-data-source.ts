import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs';
import { MdPaginator } from '@angular/material';
import { PropertySerivce } from 'root/src/services';

export class PropertyDataSource extends DataSource<any> {

  dataTotal: number;

  constructor(
    private paginator: MdPaginator,
    private propertyService: PropertySerivce
  ) {
    super();
  }

  connect(): Observable<any> {
    const displayDataChanges = [
      this.propertyService.dataChange,
      this.paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data: any = this.propertyService.dataChange.value;
      const { pageIndex, pageSize } = this.paginator;
      if (data.t) {
        const properties: any[] = data.t.slice();
        this.dataTotal = data.count;
        const startIndex: number = pageIndex * pageSize;

        return properties.splice(startIndex, pageSize);
      } else {
        return [];
      }
    })
  }

  disconnect() {

  }
}
