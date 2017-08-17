import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs';
import { DeptService } from 'root/src/services';
import { MdPaginator } from '@angular/material';

import { Subject } from 'rxjs/Subject';

export class DeptDataSource extends DataSource<any> {
  constructor(
    private deptService: DeptService,
    private paginator: MdPaginator,
    private formSubmit$: Subject<Event>
  ) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.deptService.dataChange,
      this.formSubmit$
    ];

    this.formSubmit$.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    return Observable.merge(...displayDataChanges).map(() => {
      const depts: any = this.deptService.getDeptsData();
      return depts;
    });
  }

  disconnect() {
    this.deptService.dataChange.complete();
  }
}
