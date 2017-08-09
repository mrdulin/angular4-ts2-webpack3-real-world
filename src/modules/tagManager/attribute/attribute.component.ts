import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { PropertySerivce } from 'root/src/services';
import { PropertyDataSource } from './property-data-source';
import { PaginatorService } from 'common/services';
import { Pluck } from 'common/pipes';
import { PropertyEditDialogComponent } from './propertyEditDialog';

const choiceMap: Map<string, string> = new Map<string, string>([
  ['1', '单选'],
  ['2', '多选']
]);

@Component({
  selector: 'attribute-cmp',
  templateUrl: './attribute.component.html'
})
export class AttributeComponent implements OnInit {
  tableHeaders: any[] = [
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

  @ViewChild(MdPaginator) public paginator: MdPaginator;

  constructor(
    private propertyService: PropertySerivce,
    private paginatorService: PaginatorService,
    private pluckPipe: Pluck,
    private dialog: MdDialog,
    private snackBar: MdSnackBar
  ) {
    const { pageIndex, pageSize, pageSizeOptions } = this.paginatorService;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.pageSizeOptions = pageSizeOptions;
  }

  ngOnInit() {
    this.dataSource = new PropertyDataSource(this.paginator, this.propertyService);
    this.displayedColumns = this.tableHeaders.map((header) => header.key);
    this.selectedOption = this.propertyOptions[0];
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
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
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

  managePropertyValues() {

  }
}
