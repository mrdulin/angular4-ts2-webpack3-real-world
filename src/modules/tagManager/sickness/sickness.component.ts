import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef, MdSnackBar, MdSnackBarRef, SimpleSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DiseaseService, IGetDiseasesByPageData } from 'root/src/services';
import { PaginatorService } from 'common/services';
import { IDisease, IDiseaseTagWithChildren } from 'root/src/interfaces';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

import { EditDialogComponent } from './editDialog';
import { ConfigDialogComponent } from './configDialog';

import { IQueryType, ITableHeader } from 'common/interfaces';

@Component({
  selector: 'sickness',
  templateUrl: './sickness.component.html',
  styleUrls: ['./sickness.component.css']
})
export class SicknessComponent implements OnInit, OnDestroy, AfterViewInit {
  public queryTypes: IQueryType[] = [
    { key: 'diseaseName', name: '疾病名称' },
    { key: 'ICD', name: 'ICD标准码' }
  ];
  public diseaseDataBase: DiseaseDataBase;
  public dataSource: DiseaseDataSource | null;
  public tableHeaders: ITableHeader[] = [
    { key: 'diseaseId', name: '疾病ID', cell: (row: IDisease<IDiseaseTagWithChildren>) => `${row.tagId}` },
    { key: 'diseaseName', name: '疾病名称', cell: (row: IDisease<IDiseaseTagWithChildren>) => `${row.tagName}` },
    { key: 'ICD', name: 'ICD标准码', cell: (row: IDisease<IDiseaseTagWithChildren>) => `${row.standardCode}` },
    { key: 'IDC', name: 'IDC附加码', cell: (row: IDisease<IDiseaseTagWithChildren>) => `${row.extraCode}` },
    { key: 'diseaseCategory', name: '所属疾病类目', cell: (row: IDisease<IDiseaseTagWithChildren>) => `${row.parentName}` },
    { key: 'department', name: '所属标准科室', cell: (row: IDisease<IDiseaseTagWithChildren>) => `` },
    { key: 'operator', name: '操作', cell: (row: IDisease<IDiseaseTagWithChildren>) => `` }
  ];
  public selectedQueryType: IQueryType;
  public keyword: string = '';
  public displayedColumns: string[] = [];
  public pageSize: number;
  public pageIndex: number;
  public pageSizeOptions: number[];

  @ViewChild(MdPaginator)
  public paginator: MdPaginator;

  formChange$: Subject<any> = new Subject<any>();
  subscripton: Subscription = new Subscription();

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private _diseaseService: DiseaseService,
    private _paginatorService: PaginatorService,
    private _dialog: MdDialog,
    private _snackbar: MdSnackBar
  ) {
    const { pageIndex, pageSize, pageSizeOptions } = this._paginatorService;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.pageSizeOptions = pageSizeOptions;

  }

  public ngOnInit() {
    this.selectedQueryType = this.queryTypes[0];
    this.displayedColumns = this.tableHeaders.map((header: ITableHeader) => header.key);
    this.diseaseDataBase = new DiseaseDataBase(this._diseaseService, this._snackbar, this.appConfig);
    this.dataSource = new DiseaseDataSource(this.diseaseDataBase, this.paginator, this.formChange$);

    const formChangeSub: Subscription = this.formChange$.throttleTime(2000).subscribe(($event) => this.onSubmit($event));
    this.subscripton.add(formChangeSub);
  }

  public ngAfterViewInit() {
    this._paginatorService.i18n(this.paginator, 'cn');
  }

  public ngOnDestroy() {
    this.subscripton.unsubscribe();
  }

  public onSubmit($event: any): void {
    this.keyword = this.keyword.trim();
    const firstPage: number = 1;
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

  private requestByCurrentData() {
    const pageIndex: number = this.paginator.pageIndex + 1;
    const reqData: IGetDiseasesByPageData = this.getRequestData();
    this.diseaseDataBase.getDiseasesByPage(reqData, pageIndex);
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
   * @param {IDisease<IDiseaseTagWithChildren>} disease
   * @memberof SicknessComponent
   */
  private edit(disease: IDisease<IDiseaseTagWithChildren>) {
    const dialogRef: MdDialogRef<EditDialogComponent> = this._dialog.open(EditDialogComponent, { data: disease });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.requestByCurrentData();
      }
    });
  }

  /**
   * @desc 打开配置设置模态框
   * @private
   * @param {IDisease<IDiseaseTagWithChildren>} disease
   * @memberof SicknessComponent
   */
  private config(disease: IDisease<IDiseaseTagWithChildren>) {
    let dialogRef: MdDialogRef<ConfigDialogComponent>;
    this.subscripton.add(
      this._diseaseService.getByTagId(disease.tagId).subscribe(
        (config: any) => {
          dialogRef = this._dialog.open(ConfigDialogComponent, {
            data: { disease, config }
          });

          dialogRef.afterClosed().subscribe((data) => {
            if(data) {
              this.requestByCurrentData();
            }
          });
        },
        (errMsg: string) => this._snackbar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
      )
    );
  }

  private setProperties(disease: IDisease<IDiseaseTagWithChildren>) {

  }
}

export class DiseaseDataBase {

  constructor(
    private _diseaseService: DiseaseService,
    private _snackbar: MdSnackBar,
    private _appConfig: IAppConfig
  ) {
  }

  total: number;
  dataChange: BehaviorSubject<IDisease<IDiseaseTagWithChildren>[]> = new BehaviorSubject<IDisease<IDiseaseTagWithChildren>[]>([]);

  getData(): IDisease<IDiseaseTagWithChildren>[] {
    return this.dataChange.value;
  }

  getDiseasesByPage(data: IGetDiseasesByPageData, pageIndex: number) {
    this._diseaseService.getDiseasesByPage(data, pageIndex).subscribe(
      (res: any) => {
        const { model } = res;
        const diseases: IDisease<IDiseaseTagWithChildren>[] = model.t;
        this.total = model.count;
        this.dataChange.next(diseases);
      },
      (errMsg: string) => this._snackbar.open(errMsg, null, this._appConfig.mdSnackBarConfig)
    );
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
      const diseases: IDisease<IDiseaseTagWithChildren>[] = this._diseaseDataBase.getData();
      return diseases;
    });

  }

  disconnect() {
    this._diseaseDataBase.dataChange.complete();
  }
}
