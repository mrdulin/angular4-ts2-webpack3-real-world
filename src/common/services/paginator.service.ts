import { Injectable } from '@angular/core';
import { MdPaginator } from '@angular/material';

@Injectable()
export class PaginatorService {

  pageIndex: number = 0;
  pageSize: number = 10;

  // TODO: 修改pageSize后接口数据如何显示
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSizeOptions: number[] = [];

  itemsPerPageLabel: string = '每页数据数量：';
  nextPageLabel: string = '下一页';
  previousPageLabel: string = '上一页';

  /**
   * 在组件的ngOnInit或者ngAfterViewInit声明周期钩子函数中调用，设置分页组件的显示文案
   *
   * @param {MdPaginator} paginator
   * @memberof PaginatorService
   */
  setI18n(paginator: MdPaginator) {
    const { itemsPerPageLabel, nextPageLabel, previousPageLabel } = this;
    Object.assign(paginator._intl, { itemsPerPageLabel, nextPageLabel, previousPageLabel });
  }

}

