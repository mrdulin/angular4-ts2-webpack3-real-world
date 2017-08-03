import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { SicknessService } from './services/sickness.service';
import { PaginatorService } from 'common/services';
import { Disease, IDisease } from './models/disease.model';

import { EditDialogComponent } from './components/editDialog';

interface IQueryType {
  key: string;
  name: string;
}

interface ITableHeader extends IQueryType {
  cell(row: any): string;
}

@Component({
  selector: 'sickness',
  templateUrl: './sickness.component.html',
  styleUrls: ['./sickness.component.css'],
  providers: [SicknessService]
})
export class SicknessComponent implements OnInit {
  public queryTypes: IQueryType[] = [
    { key: 'diseaseName', name: '疾病名称' },
    { key: 'ICD', name: 'ICD标准码' }
  ];
  public diseaseDataBase: DiseaseDataBase;
  public dataSource: DiseaseDataSource | null;
  public tableHeaders: ITableHeader[] = [
    { key: 'diseaseId', name: '疾病ID', cell: (row: IDisease) => `${row.tagId}` },
    { key: 'diseaseName', name: '疾病名称', cell: (row: IDisease) => `${row.tagName}` },
    { key: 'ICD', name: 'ICD标准码', cell: (row: IDisease) => `${row.standardCode}` },
    { key: 'IDC', name: 'IDC附加码', cell: (row: IDisease) => `${row.extraCode}` },
    { key: 'diseaseCategory', name: '所属疾病类目', cell: (row: IDisease) => `${row.parentName}` },
    { key: 'department', name: '所属标准科室', cell: (row: IDisease) => `` },
    { key: 'operator', name: '操作', cell: (row: IDisease) => `` }
  ];
  public selectedQueryType: IQueryType;
  public keyword: string;
  public displayedColumns: string[] = [];
  public pageSize: number;
  public pageIndex: number;
  public pageSizeOptions: number[];

  public dialogRef: MdDialogRef<EditDialogComponent>;


  @ViewChild(MdPaginator)
  public paginator: MdPaginator;

  constructor(
    private _sicknessService: SicknessService,
    private _paginatorService: PaginatorService,
    private _dialog: MdDialog
  ) {
    this.pageIndex = this._paginatorService.pageIndex;
    this.pageSize = this._paginatorService.pageSize;
    this.pageSizeOptions = this._paginatorService.pageSizeOptions;
  }

  public ngOnInit() {
    this.selectedQueryType = this.queryTypes[0];
    this.displayedColumns = this.tableHeaders.map((header: ITableHeader) => header.key);
    this.diseaseDataBase = new DiseaseDataBase(this._sicknessService);
    this.dataSource = new DiseaseDataSource(this.diseaseDataBase, this.paginator);
  }

  public onSubmit(): void {
    console.log(this.selectedQueryType, this.keyword);
    const firstPage: number = this.pageIndex + 1;
    this.paginator.pageIndex = 0;
    console.log(this.paginator)
    this.diseaseDataBase.getDiseasesByPage(this.keyword, firstPage);
  }

  public onPageChange(e: PageEvent) {
    const pageIndex: number = e.pageIndex + 1;
    this.diseaseDataBase.getDiseasesByPage(this.keyword, pageIndex);
  }

  public trackByFn(index: number, tableHeader: ITableHeader) {
    return tableHeader.key;
  }

  private edit(disease: IDisease) {
    this.dialogRef = this._dialog.open(EditDialogComponent, {
      data: disease
    });
  }
}

export class DiseaseDataBase {

  constructor(
    private _sicknessService: SicknessService
  ) {
  }

  total: number;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  getData(): any[] {
    return this.dataChange.value;
  }

  getDiseasesByPage(q: string, pageIndex: number) {
    return this._sicknessService.getDiseasesByPage(q, pageIndex).subscribe((data: any) => {
      const { model, error, errorCode } = data;
      const diseases: IDisease[] = model.t;
      const total: number = model.count;

      this.dataChange.next(diseases);
      this.total = total;
    });
  }
}

export class DiseaseDataSource extends DataSource<any>{
  constructor(
    private _diseaseDataBase: DiseaseDataBase,
    private _paginator: MdPaginator
  ) {
    super();
  }

  connect(): Observable<any> {
    return this._diseaseDataBase.dataChange.asObservable().map(() => {
      const books = this._diseaseDataBase.getData() || [];
      // const startIndex: number = this._paginator.pageIndex * this._paginator.pageSize;
      // return books.splice(startIndex, this._paginator.pageSize);
      return books;
    });
  }

  disconnect() {
    this._diseaseDataBase.dataChange.complete();
  }
}
