import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs';
import { DeptService } from 'root/src/services';

export class DeptDataSource extends DataSource<any> {
  constructor(
    private deptService: DeptService
  ) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.deptService.dataChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.deptService.getDeptsData();
      const { t } = <any>data;

      return t;
    });
  }

  disconnect(): void {
    this.deptService.dataChange.complete();
  }
}
