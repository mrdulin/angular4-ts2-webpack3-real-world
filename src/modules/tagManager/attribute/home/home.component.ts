import { Component, OnInit, OnDestroy, ViewChild, Inject, ElementRef } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { Router, ActivatedRoute, NavigationEnd, Event, NavigationExtras, Params } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

import { PropertySerivce, IQueryCondition } from 'root/src/services';
import { PropertyDataSource } from './property-data-source';
import { PaginatorService } from 'common/services';
import { ITableHeader } from 'common/interfaces';
import { Pluck } from 'common/pipes';
import { PropertyEditDialogComponent } from '../propertyEditDialog';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'attribute-home',
  templateUrl: './home.component.html'
})
export class AttributeHomeComponent implements OnInit, OnDestroy {
  tableHeaders: ITableHeader[] = [
    { key: 'propertyName', name: '属性项名称', cell: (row: any) => row.propertyName },
    { key: 'propertyId', name: '属性ID', cell: (row: any) => row.propertyId },
    { key: 'choice', name: '选择类型', cell: (row: any) => PropertySerivce.choiceMap.get(row.choice) },
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
  @ViewChild('keywordInputRef') public keywordInputRef: ElementRef;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private propertyService: PropertySerivce,
    private paginatorService: PaginatorService,
    private pluckPipe: Pluck,
    private dialog: MdDialog,
    private snackBar: MdSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const { q, pageIndex } = params;
      if (q && q.trim()) {
        this.keyword = q;
        this.paginator.pageIndex = pageIndex - 1;
        this.getPropertiesByName(q, pageIndex);
      }
    });

    // const sub: Subscription = this.router.events
    //   .filter((event: Event): boolean => event instanceof NavigationEnd)
    //   .pairwise()
    //   .subscribe((events: [NavigationEnd, NavigationEnd]) => {
    //     const prevRouteUrl: string = events[0].url;
    //     const currentRouteUrl: string = events[1].url;

    //     if (prevRouteUrl.indexOf(`${currentRouteUrl}/edit`) !== -1) {
    //       const lastQueryCondition: IQueryCondition = this.propertyService.getQueryCondition();
    //       const { pageIndex, keyword }: { pageIndex: number, keyword: string } = lastQueryCondition;
    //       console.log(lastQueryCondition);

    //       //TODO: 这里重新赋值没有触发view更新??
    //       this.keyword = keyword;
    //       this.paginator.pageIndex = pageIndex;

    //       this.getPropertiesByName(keyword, pageIndex + 1);
    //     }
    //   });


    // TODO: 组件销毁时，unsubscribe router.events后，以后都不会触发route.events
    // this.subscription.add(sub);
  }

  ngOnDestroy() {
    // this.cdRef.detach();
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const keyword: string = this.keyword.trim();
    if (!keyword) return;
    const firstPage: number = 1;
    const navigationExtras: NavigationExtras = this.getNavigationExtras();
    this.router.navigate(['/tag-manager/attribute'], navigationExtras);
  }

  getNavigationExtras(): NavigationExtras {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        q: this.keyword,
        pageIndex: this.paginator.pageIndex + 1,
      }
    };
    return navigationExtras;
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
      data: { property, choiceMap: PropertySerivce.choiceMap }
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
    const navigationExtras: NavigationExtras = Object.assign(this.getNavigationExtras(), { relativeTo: this.activatedRoute });
    // const condition: IQueryCondition = {
    //   keyword: this.keyword,
    //   pageIndex: this.paginator.pageIndex
    // };
    // this.propertyService.saveQueryCondition(condition);
    this.propertyService.setCurrentEditProperty(property);
    this.router.navigate(['edit', propertyId], navigationExtras);
  }
}
