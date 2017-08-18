import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs';
import { DiseaseHomeService, IEntranceData } from 'root/src/services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IProperty, IDiseaseCenterEntranceData } from 'root/src/interfaces';

export class EntranceDataSource extends DataSource<any>{
  dataChange: BehaviorSubject<IDiseaseCenterEntranceData[]> = new BehaviorSubject<IDiseaseCenterEntranceData[]>([]);
  dataTotal: number = 0;

  constructor(
    private diseaseHomeService: DiseaseHomeService
  ) {
    super();
  }

  getData(): IDiseaseCenterEntranceData[] {
    return this.dataChange.value;
  }

  queryEntranceInfo(params: IEntranceData) {
    return this.diseaseHomeService.getEntranceData(params)
      .map((res: any) => {
        const { model } = res
        const entranceData: IDiseaseCenterEntranceData[] = model.t || [];
        this.dataTotal = model.count;
        this.dataChange.next(entranceData);
      });
  }

  connect(): Observable<IDiseaseCenterEntranceData[]> {
    const displayChanges = [
      this.dataChange
    ];

    return Observable.merge(...displayChanges).map((data) => {
      const entranceData: IDiseaseCenterEntranceData[] = this.getData();
      return entranceData;
    });
  }

  disconnect() {
    this.dataChange.complete();
  }
}
