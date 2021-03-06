import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef, MdSnackBar, MdSnackBarRef, SimpleSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DiseaseService, IGetDiseasesByPageData } from 'root/src/services';
import { PaginatorService } from 'common/services';
import { IDisease, IDiseaseTagWithChildren, IApiResponse, IModel, IPagination } from 'root/src/interfaces';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

import { EditDialogComponent } from './editDialog';
import { ConfigDialogComponent } from './configDialog';
import { CreateDialogComponent } from './createDialog';

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
  public dataSource: DiseaseDataSource | null;
  public tableHeaders: ITableHeader[] = [
    { key: 'diseaseId', name: '疾病ID', cell: (row: IDisease<IDiseaseTagWithChildren>) => row.tagId },
    { key: 'diseaseName', name: '疾病名称', cell: (row: IDisease<IDiseaseTagWithChildren>) => row.tagName },
    { key: 'ICD', name: 'ICD标准码', cell: (row: IDisease<IDiseaseTagWithChildren>) => row.standardCode },
    { key: 'IDC', name: 'IDC附加码', cell: (row: IDisease<IDiseaseTagWithChildren>) => row.extraCode },
    { key: 'diseaseCategory', name: '所属疾病类目', cell: (row: IDisease<IDiseaseTagWithChildren>) => row.parentName },
    { key: 'department', name: '所属标准科室', cell: (row: IDisease<IDiseaseTagWithChildren>) => `` },
    { key: 'operator', name: '操作', cell: (row: IDisease<IDiseaseTagWithChildren>) => `` }
  ];
  public selectedQueryType: IQueryType;
  public keyword: string = '';
  public displayedColumns: string[] = [];
  public pageSize: number;
  public pageIndex: number;
  public pageSizeOptions: number[];

  private buttonHandlerMap: Map<string, Function>;

  loading: boolean;

  @ViewChild(MdPaginator)
  public paginator: MdPaginator;

  formChange$: Subject<Event> = new Subject<Event>();
  configButton$: Subject<IDisease<IDiseaseTagWithChildren>> = new Subject();
  editButton$: Subject<IDisease<IDiseaseTagWithChildren>> = new Subject();
  setPropertiesButton$: Subject<IDisease<IDiseaseTagWithChildren>> = new Subject();

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

    this.getDiseasesByPageFailed = this.getDiseasesByPageFailed.bind(this);
    this.buttonHandlerMap = new Map([
      ['config', this.config],
      ['edit', this.edit],
      ['setProperties', this.setProperties]
    ]);
  }

  public ngOnInit() {
    this.selectedQueryType = this.queryTypes[0];
    this.displayedColumns = this.tableHeaders.map((header: ITableHeader) => header.key);
    this.dataSource = new DiseaseDataSource(this._diseaseService, this.paginator, this.formChange$);

    this.setFormSubmitStream$();
    this.setButtonStream$();
  }

  private setFormSubmitStream$() {
    this.subscripton.add(
      this.formChange$
        .throttleTime(2000)
        .do(() => this.showLoading())
        .switchMap(($event) => this.getDiseasesByPage($event))
        // 由于formChange$在组件的生命周期内始终没有complete，所以不会触发finally
        // https://github.com/angular/angular/issues/7865
        // .finally(() => {
        //   console.log('done');
        //   this.loading = false;
        // })
        .subscribe(() => this.hideLoading(), this.getDiseasesByPageFailed)
    );
  }

  /**
   * 限制 操作 三个按钮的点击时间间隔
   *
   * @private
   * @memberof SicknessComponent
   */
  private setButtonStream$() {
    this.subscripton.add(
      Observable.merge(
        this.configButton$,
        this.editButton$,
        this.setPropertiesButton$
      )
        .throttleTime(1000)
        .subscribe((val: IDisease<IDiseaseTagWithChildren> & { handler: string }) => {
          const handlerName: string = val.handler;
          const handler: Function = this.buttonHandlerMap.get(handlerName);
          handler(val);
        })
    );
  }

  private showLoading() {
    this.loading = true;
  }

  private hideLoading() {
    this.loading = false;
  }

  public ngAfterViewInit() {
    this._paginatorService.i18n(this.paginator, 'cn');
  }

  public ngOnDestroy() {
    this.subscripton.unsubscribe();
  }

  public getDiseasesByPage($event: Event): Observable<any> {
    console.log($event);
    this.keyword = this.keyword.trim();
    const firstPage: number = 1;
    const data: IGetDiseasesByPageData = this.getRequestData();
    return this.dataSource.getDiseasesByPage(data, firstPage)

  }

  public onPageChange(e: PageEvent) {
    const pageIndex: number = e.pageIndex + 1;
    const data: IGetDiseasesByPageData = this.getRequestData();
    this.dataSource.getDiseasesByPage(data, pageIndex).subscribe(null, this.getDiseasesByPageFailed);
  }

  public trackByFn(index: number, tableHeader: ITableHeader): string {
    return tableHeader.key;
  }

  private getDiseasesByPageFailed(errMsg: string) {
    this._snackbar.open(errMsg, null, this.appConfig.mdSnackBarConfig);
    this.hideLoading();
  }

  private requestByCurrentData() {
    const pageIndex: number = this.paginator.pageIndex + 1;
    const reqData: IGetDiseasesByPageData = this.getRequestData();
    this.dataSource.getDiseasesByPage(reqData, pageIndex).subscribe(null, this.getDiseasesByPageFailed);
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
  private edit = (disease: IDisease<IDiseaseTagWithChildren>) => {
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
  private config = (disease: IDisease<IDiseaseTagWithChildren>) => {
    let dialogRef: MdDialogRef<ConfigDialogComponent>;
    this.subscripton.add(
      this._diseaseService.getByTagId(disease.tagId).subscribe(
        (config: any) => {
          dialogRef = this._dialog.open(ConfigDialogComponent, {
            data: { disease, config }
          });

          dialogRef.afterClosed().subscribe((data) => {
            if (data) {
              this.requestByCurrentData();
            }
          });
        },
        (errMsg: string) => this._snackbar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
      )
    );
  }

  private setProperties = (disease: IDisease<IDiseaseTagWithChildren>) => {
    console.log(disease);
  }

  private create() {
    this._dialog.open(CreateDialogComponent);
  }
}

export class DiseaseDataSource extends DataSource<any>{
  constructor(
    private _diseaseService: DiseaseService,
    private _paginator: MdPaginator,
    private _formChange$: Subject<Event>
  ) {
    super();
  }

  total: number = 0;
  dataChange: BehaviorSubject<IDisease<IDiseaseTagWithChildren>[]> = new BehaviorSubject<IDisease<IDiseaseTagWithChildren>[]>([]);

  getData(): IDisease<IDiseaseTagWithChildren>[] {
    return this.dataChange.value;
  }

  getDiseasesByPage(data: IGetDiseasesByPageData, pageIndex: number): Observable<any> {
    return this._diseaseService.getDiseasesByPage(data, pageIndex).map((model: IModel<IDisease<IDiseaseTagWithChildren>> & IPagination) => {
      const diseases: IDisease<IDiseaseTagWithChildren>[] = model.t;
      this.total = model.count;
      this.dataChange.next(diseases);
    });
  }
  connect(): Observable<any> {
    const displayDataChanges = [
      this.dataChange,
      this._formChange$,
    ];

    this._formChange$.subscribe(() => {
      this._paginator.pageIndex = 0;
    });

    return Observable.merge(...displayDataChanges).map(() => {
      const diseases: IDisease<IDiseaseTagWithChildren>[] = this.getData();
      return diseases;
    });
  }

  disconnect() {
    this.dataChange.complete();
  }
}
