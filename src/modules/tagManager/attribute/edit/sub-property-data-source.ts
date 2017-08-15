import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs';
import { PropertySerivce } from 'root/src/services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IProperty } from 'root/src/interfaces';

export class SubPropertyDataSource extends DataSource<any>{
  dataChange: BehaviorSubject<IProperty[]> = new BehaviorSubject<IProperty[]>([]);
  dataTotal: number = 0;

  constructor(
    private propertyService: PropertySerivce
  ) {
    super();

    const currentEditProperty = this.propertyService.getCurrentEditProperty();
    const id: string | number = currentEditProperty.propertyId;
  }

  getData(): IProperty[] {
    return this.dataChange.value;
  }

  addSubProperty(postBody: any): Observable<any> {
    return this.propertyService.saveSubProperty(postBody)
    // .map(() => {
    //   const oldValues = this.getData();
    //   const newValues = [...postBody.subProperties, ...oldValues];
    //   this.dataChange.next(newValues);
    // });
  }

  getSubPropertiesById(id: string | number) {
    return this.propertyService.getChildPropertiesById(id)
      .map((res: any) => {
        const subProperties: IProperty[] = res.model || [];
        this.dataTotal = subProperties.length;
        this.dataChange.next(subProperties);
      });
  }

  connect(): Observable<IProperty[]> {
    const displayChanges = [
      this.dataChange
    ];

    return Observable.merge(...displayChanges).map((data) => {
      const subProperties: IProperty[] = this.getData();
      return subProperties;
    });
  }

  disconnect() {
    this.dataChange.complete();
  }
}
