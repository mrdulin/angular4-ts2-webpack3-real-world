export * from './disease';
export * from './disease-center';
export * from './property';

export interface IApiResponseBase{
  error: null | string;
  errorCode: number;
  success: boolean;
}

export interface IApiResponseModel<T, R> {
  model: T & R;
}

export interface IApiResponse<T, R = {}> extends IApiResponseBase, IApiResponseModel<T, R> {}

export interface IPagination{
  count: number;
  pageNo: number;
  pageSize: number;
  pageTotal: number;
}

export interface IModel<T>{
  t: T[];
}
