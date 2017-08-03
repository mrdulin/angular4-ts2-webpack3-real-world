import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig{
  api: string;
  mockApi: boolean;
}

export const AppConfig: IAppConfig = {
  api: '//umr.test.pajkdc.com/innerApi',

  //全局mock开关，true, 使用本地json，false，走http请求
  mockApi: true
};


