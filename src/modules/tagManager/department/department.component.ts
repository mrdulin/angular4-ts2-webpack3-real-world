import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { DeptService } from 'root/src/services';
import { PaginatorService } from 'common/services';
import { DeptDataSource } from './depart-data-source';

import { DeptEditDialogComponent } from './deptEditDialog';
import { AddDeptDialogComponent } from './addDeptDialog';

@Component({
  selector: 'department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[];

  dataSource: DeptDataSource | null;

  tagName: string = '';

  @ViewChild(MdPaginator) paginator: MdPaginator;

  tableHeaders: any[] = [
    { key: 'tagName', name: '科室名称', cell: (row: any) => `${row.tagId}` },
    { key: 'tagId', name: '科室ID', cell: (row: any) => `${row.tagName}` },
    { key: 'tagLevel', name: '科室级别', cell: (row: any) => `${row.tagLevel}` },
    { key: 'parentName', name: '上级科室', cell: (row: any) => `${row.parentName}` },
    { key: 'operator', name: '操作', cell: (row: any) => `` }
  ];
  displayedColumns: string[] = [];

  constructor(
    private deptService: DeptService,
    private paginatorService: PaginatorService,
    private dialog: MdDialog
  ) {
    const { pageIndex, pageSize, pageSizeOptions } = this.paginatorService;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.pageSizeOptions = pageSizeOptions;
  }

  ngOnInit() {
    this.displayedColumns = this.tableHeaders.map((header) => header.key);
    this.dataSource = new DeptDataSource(this.deptService, this.paginator);
  }

  onSumbit() {
    this.tagName = this.tagName.trim();
    const firstPage: number = 1;
    this.deptService.getDeptsByPage(this.tagName, firstPage);
  }

  requestByCurrentData() {
    const pageIndex: number = this.paginator.pageIndex + 1;
    this.deptService.getDeptsByPage(this.tagName, pageIndex);
  }

  /**
   * 编辑科室
   *
   * @param {*} dept
   * @memberof DepartmentComponent
   */
  edit(dept: any) {
    const dialogRef: MdDialogRef<DeptEditDialogComponent> = this.dialog.open(DeptEditDialogComponent, { data: dept });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && this.deptService.count) {
        this.requestByCurrentData();
      }
    });
  }

  setProperties(dept: any) {

  }

  /**
   * 新增科室
   *
   * @memberof DepartmentComponent
   */
  addDept() {
    const dialogRef: MdDialogRef<AddDeptDialogComponent> = this.dialog.open(AddDeptDialogComponent);
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.requestByCurrentData();
      }
    });
  }

  onPageChange(event: PageEvent) {
    const pageIndex: number = event.pageIndex + 1;
    this.deptService.getDeptsByPage(this.tagName, pageIndex);
  }

}
