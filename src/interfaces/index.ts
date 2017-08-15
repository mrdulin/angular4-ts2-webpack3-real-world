export * from './disease';
export * from './disease-center';
export * from './property';

export interface IApiResponse<T>{
  error: null | string;
  errorCode: number;
  model: T;
  success: boolean;
}
