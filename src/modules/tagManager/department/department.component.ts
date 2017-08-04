import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { DeptService } from 'root/src/services';
import { PaginatorService } from 'common/services';

import { TipDialogComponent } from 'common/components/dialog';

@Component({
  selector: 'department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[];

  dept: string = '';

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

  }

  onSumbit() {
    this.dept = this.dept.trim();
    if (!this.dept) return;
    console.log(this.dept);
  }

  edit() {
    this.dialog.open(TipDialogComponent, {
      data: {
        msg: 123123123123
      }
    });
  }

  onPageChange() {

  }

}
