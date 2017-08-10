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
      // this.paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data: any = this.propertyService.dataChange.value;
      // const { pageIndex, pageSize } = this.paginator;
      const properties: any[] = data.t;
      this.dataTotal = data.count;

      // const startIndex: number = pageIndex * pageSize;
      // return properties.splice(startIndex, pageSize);

      return properties;
    })
  }

  disconnect() {
    // 这里如果调用complete，由于propertyService在根模块中注入，是全局单例，跳转到其他路由，在跳转回来，
    // 在propertyService中再次dataChange.next(), 不会再次发出新的值。
    // 所以要保证dataChange这个behaviorSubject始终能发出新的值，可以是在组件类实例化的时候重新声明
    // 参考sickness - DiseaseDataBase，这个类在组件每次实例化（路由导航到该组件）时也会重新实例化一次。
    // 保证dataChange这个behaviorSubject始终未complete的，尽管组件实例销毁时dataChange这个behaviorSubject调用了complete()方法。

    // 如果dataChange这个behaviorSubject声明在了service中，
    // 另一种方式是在组件层级注入propertyService，这样组件的每次实例化，该service也会重新实例化。保证dataChange始终可以调用next()发出值。

    // this.propertyService.dataChange.complete();
  }
}
