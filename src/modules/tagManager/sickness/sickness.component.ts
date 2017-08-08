import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DiseaseService, IGetDiseasesByPageData } from 'root/src/services';
import { PaginatorService } from 'common/services';
import { Disease, IDisease } from 'root/src/models';

import { EditDialogComponent } from './editDialog';
import { ConfigDialogComponent } from './configDialog';

import {IQueryType, ITableHeader} from 'common/interfaces';

@Component({
  selector: 'sickness',
  templateUrl: './sickness.component.html',
  styleUrls: ['./sickness.component.css']
})
export class SicknessComponent implements OnInit, OnDestroy {
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
  public keyword: string = '';
  public displayedColumns: string[] = [];
  public pageSize: number;
  public pageIndex: number;
  public pageSizeOptions: number[];

  @ViewChild(MdPaginator)
  public paginator: MdPaginator;

  formChange$: Subject<boolean> = new Subject<boolean>();
  subscripton: Subscription = new Subscription();

  constructor(
    private _diseaseService: DiseaseService,
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
    this.diseaseDataBase = new DiseaseDataBase(this._diseaseService);
    this.dataSource = new DiseaseDataSource(this.diseaseDataBase, this.paginator, this.formChange$);
  }

  public ngOnDestroy() {
    this.subscripton.unsubscribe();
  }

  public onSubmit(): void {
    this.keyword = this.keyword.trim();
    if (!this.keyword) return;
    const firstPage: number = this.pageIndex + 1;
    this.formChange$.next(true);
    const data: IGetDiseasesByPageData = this.getRequestData();
    this.diseaseDataBase.getDiseasesByPage(data, firstPage);
  }


  public onPageChange(e: PageEvent) {
    const pageIndex: number = e.pageIndex + 1;
    const data: IGetDiseasesByPageData = this.getRequestData();
    this.diseaseDataBase.getDiseasesByPage(data, pageIndex);
  }

  public trackByFn(index: number, tableHeader: ITableHeader) {
    return tableHeader.key;
  }

  private getRequestData(): IGetDiseasesByPageData {
    const data: IGetDiseasesByPageData = {
      type: this.selectedQueryType.key,
      value: this.keyword
    };
    return data;
  }

  /**
   *
   * @desc 打开编辑疾病模态框
   * @private
   * @param {IDisease} disease
   * @memberof SicknessComponent
   */
  private edit(disease: IDisease) {
    const dialogRef: MdDialogRef<EditDialogComponent> = this._dialog.open(EditDialogComponent, {
      data: disease
    });
  }

  /**
   * @desc 打开配置设置模态框
   * @private
   * @param {IDisease} disease
   * @memberof SicknessComponent
   */
  private config(disease: IDisease) {
    // TODO: http://umr.test.pajkdc.com/innerApi/tag/disease/config?tagId=1001000
    // 打开配置设置模态框, 先调service请求该疾病的配置，请求成功后打开模态框，请求失败，全局模态框错误提示。

    this.subscripton.add(
      this._diseaseService.getByTagId(disease.tagId).subscribe((config: any) => {
        const dialogRef: MdDialogRef<ConfigDialogComponent> = this._dialog.open(ConfigDialogComponent, {
          data: {
            disease,
            config
          }
        });
      })
    );
  }

  private setProperties(disease: IDisease) {

  }
}

export class DiseaseDataBase {

  constructor(
    private _diseaseService: DiseaseService
  ) {
  }

  total: number;
  dataChange: BehaviorSubject<IDisease[]> = new BehaviorSubject<IDisease[]>([]);

  getData(): IDisease[] {
    return this.dataChange.value;
  }

  getDiseasesByPage(data: IGetDiseasesByPageData, pageIndex: number) {
    return this._diseaseService.getDiseasesByPage(data, pageIndex).subscribe((res: any) => {
      const { model, error, errorCode } = res;
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
    private _paginator: MdPaginator,
    private _formChange$: Subject<boolean>
  ) {
    super();
  }

  connect(): Observable<any> {
    const displayDataChanges = [
      this._diseaseDataBase.dataChange,
      // this._paginator.page,
      this._formChange$,
    ];

    this._formChange$.subscribe(() => {
      this._paginator.pageIndex = 0;
    });

    return Observable.merge(...displayDataChanges).map(() => {
      const diseases: IDisease[] = this._diseaseDataBase.getData();
      return diseases;
    });

  }

  disconnect() {
    this._diseaseDataBase.dataChange.complete();
  }
}
