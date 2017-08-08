import { Injectable } from '@angular/core';

@Injectable()
export class PaginatorService {

  pageIndex: number = 0;
  pageSize: number = 10;

  // TODO: 修改pageSize后接口数据如何显示
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSizeOptions: number[] = [];

}

