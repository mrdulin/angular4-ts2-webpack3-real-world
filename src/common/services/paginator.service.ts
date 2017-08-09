import { Injectable } from '@angular/core';
import { MdPaginator } from '@angular/material';

export interface IPaginatorLabel {
  itemsPerPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
}

@Injectable()
export class PaginatorService {

  labelMap: Map<string, IPaginatorLabel> = new Map([
    ['cn', {
      itemsPerPageLabel: '每页数据数量：',
      nextPageLabel: '下一页',
      previousPageLabel: '上一页'
    }]
  ])

  pageIndex: number = 0;
  pageSize: number = 10;

  // TODO: 修改pageSize后接口数据如何显示
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSizeOptions: number[] = [];

  /**
   * 在组件的ngOnInit或者ngAfterViewInit声明周期钩子函数中调用，设置分页组件的显示文案
   *
   * @param {MdPaginator} paginator
   * @memberof PaginatorService
   */
  i18n(paginator: MdPaginator, lang: string) {
    const { itemsPerPageLabel, nextPageLabel, previousPageLabel } = this.labelMap.get(lang);
    Object.assign(paginator._intl, { itemsPerPageLabel, nextPageLabel, previousPageLabel });
  }

}

