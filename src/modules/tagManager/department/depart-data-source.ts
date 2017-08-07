import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs';
import { DeptService } from 'root/src/services';
import { MdPaginator } from '@angular/material';

export class DeptDataSource extends DataSource<any> {
  constructor(
    private deptService: DeptService,
    private paginator: MdPaginator
  ) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.deptService.dataChange,
      this.paginator.page
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const depts: any = this.deptService.getDeptsData().slice();
      const { pageSize, pageIndex } = this.paginator;
      const startIndex: number = pageIndex * pageSize;
      return depts.splice(startIndex, pageSize);
    });
  }

  disconnect(): void {
    this.deptService.dataChange.complete();
  }
}
