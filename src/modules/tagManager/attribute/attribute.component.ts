import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

import { PropertySerivce, IQueryCondition } from 'root/src/services';
import { PropertyDataSource } from './property-data-source';
import { PaginatorService } from 'common/services';
import { ITableHeader } from 'common/interfaces';
import { Pluck } from 'common/pipes';
import { PropertyEditDialogComponent } from './propertyEditDialog';

import { Subscription } from 'rxjs/Subscription';

const choiceMap: Map<string, string> = new Map<string, string>([
  ['1', '单选'],
  ['2', '多选']
]);

@Component({
  selector: 'attribute-cmp',
  templateUrl: './attribute.component.html'
})
export class AttributeComponent implements OnInit, OnDestroy {
  tableHeaders: ITableHeader[] = [
    { key: 'propertyName', name: '属性项名称', cell: (row: any) => row.propertyName },
    { key: 'propertyId', name: '属性ID', cell: (row: any) => row.propertyId },
    { key: 'choice', name: '选择类型', cell: (row: any) => choiceMap.get(row.choice) },
    { key: 'parentName', name: '父属性项', cell: (row: any) => row.parentName },
    { key: 'propertyValuesCount', name: '属性值数量', cell: (row: any) => row.propertyValues ? row.propertyValues.length : 0 },
    { key: 'propertyValues', name: '属性值', cell: (row: any) => this.pluckPipe.transform(row.propertyValues, 'propertyValue') },
    { key: 'operator', name: '操作', cell: () => `` }
  ];
  displayedColumns: string[] = [];

  dataSource: any;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];

  keyword: string = '';

  propertyOptions: any[] = [
    { key: 'propertyName', name: '属性项名称' }
  ];
  selectedOption: any;

  private subscription: Subscription = new Subscription();

  @ViewChild(MdPaginator) public paginator: MdPaginator;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private propertyService: PropertySerivce,
    private paginatorService: PaginatorService,
    private pluckPipe: Pluck,
    private dialog: MdDialog,
    private snackBar: MdSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    const { pageIndex, pageSize, pageSizeOptions } = this.paginatorService;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.pageSizeOptions = pageSizeOptions;
  }

  ngOnInit() {
    this.dataSource = new PropertyDataSource(this.paginator, this.propertyService);
    this.displayedColumns = this.tableHeaders.map((header: ITableHeader): string => header.key);
    this.selectedOption = this.propertyOptions[0];

    this.paginatorService.i18n(this.paginator, 'cn');

    const sub: Subscription = this.router.events
      .filter((event: Event): boolean => event instanceof NavigationEnd)
      .pairwise()
      .subscribe((events: [NavigationEnd, NavigationEnd]) => {
        const prevRouteUrl: string = events[0].url;
        const currentRouteUrl: string = events[1].url;

        if (prevRouteUrl.indexOf(`${currentRouteUrl}/edit`) !== -1) {
          const lastQueryCondition: IQueryCondition = this.propertyService.getQueryCondition();
          const { pageIndex, keyword }: { pageIndex: number, keyword: string } = lastQueryCondition;

          //TODO: 这里重新赋值没有触发view更新??
          this.keyword = keyword;
          this.paginator.pageIndex = pageIndex;
          this.getPropertiesByName(keyword, pageIndex + 1);
        }
      });

    // TODO: 组件销毁时，unsubscribe router.events后，以后都不会触发route.events
    // this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const keyword: string = this.keyword.trim();
    if (!keyword) return;
    const firstPage: number = 1;
    this.getPropertiesByName(keyword, firstPage);
  }

  getPropertiesByName(keyword: string, pageIndex: number) {
    this.propertyService.getPropertiesByName(keyword, pageIndex).subscribe(
      () => null,
      (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
    );
  }

  onPageChange(e: PageEvent) {
    const pageIndex: number = e.pageIndex + 1;
    this.propertyService.getPropertiesByName(this.keyword, pageIndex);
  }

  edit(property: any) {
    const dialogRef: MdDialogRef<PropertyEditDialogComponent> = this.dialog.open(PropertyEditDialogComponent, {
      data: { property, choiceMap }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const pageIndex: number = this.paginator.pageIndex + 1;
        this.getPropertiesByName(this.keyword, pageIndex);
      }
    });
  }

  managePropertyValues(property: any) {
    const { propertyId } = property;
    const condition: IQueryCondition = {
      keyword: this.keyword,
      pageIndex: this.paginator.pageIndex
    };
    this.propertyService.setCurrentEditProperty(property);
    this.propertyService.saveQueryCondition(condition);
    this.router.navigate(['edit', propertyId], { relativeTo: this.activatedRoute });
  }
}
