export interface IQueryType {
  key: string;
  name: string;
}

export interface ITableHeader extends IQueryType {
  cell(row: any): any;
}

