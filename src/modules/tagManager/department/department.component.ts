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

  dept: string = '';

  @ViewChild(MdPaginator) paginator: MdPaginator;

  tableHeaders: any[] = [
    { key: 'tagName', name: '科室名称', cell: (row: any) => `${row.tagId}` },
    { key: 'tagId', name: '疾病名称', cell: (row: any) => `${row.tagName}` },
    { key: 'tagLevel', name: 'ICD标准码', cell: (row: any) => `${row.standardCode}` },
    { key: 'parentName', name: 'IDC附加码', cell: (row: any) => `${row.extraCode}` },
    { key: 'operator', name: '操作', cell: (row: any) => `` }
  ];
  displayedColumns: string[] = [];

  constructor(
    private deptService: DeptService,
    private paginatorService: PaginatorService,
    private dialog: MdDialog
  ) {
    this.pageIndex = this.paginatorService.pageIndex;
    this.pageSize = this.paginatorService.pageSize;
    this.pageSizeOptions = this.paginatorService.pageSizeOptions;
  }

  ngOnInit() {
    this.displayedColumns = this.tableHeaders.map((header) => header.key);
    this.dataSource = new DeptDataSource(this.deptService, this.paginator);
  }

  onSumbit() {
    this.dept = this.dept.trim();
    if (!this.dept) return;
    const firstPage: number = 1;

    this.deptService.getDeptsByPage(this.dept, firstPage);
  }

  edit(dept: any) {
    this.dialog.open(DeptEditDialogComponent, {
      data: dept
    });
  }

  setProperties(dept: any) {

  }

  addDept() {
    const dialogRef: MdDialogRef<AddDeptDialogComponent> = this.dialog.open(AddDeptDialogComponent);
    dialogRef.afterClosed().subscribe((dept: any) => {
      console.log(dept);
    });
  }

  onPageChange() {

  }

  useTrackBy(index: number, item: any) {
    // console.log('useTrackBy', item);
    return item.tagId;
  }

}
