import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';

import { DeptService } from 'root/src/services';
import { PaginatorService } from 'common/services';

@Component({
  selector: 'department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[];

  constructor(
    private deptService: DeptService,
    private paginatorService: PaginatorService
  ) {

    this.pageIndex = this.paginatorService.pageIndex;
    this.pageSize = this.paginatorService.pageSize;
    this.pageSizeOptions = this.paginatorService.pageSizeOptions;

  }

  ngOnInit() {

  }

}
