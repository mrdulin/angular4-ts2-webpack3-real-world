import { Injectable } from '@angular/core';

@Injectable()
export class PaginatorService {

  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

}

