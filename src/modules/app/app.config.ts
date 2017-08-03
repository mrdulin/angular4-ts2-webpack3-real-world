import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig{
  api: string;
  mockApi: boolean;
}

export const AppConfig: IAppConfig = {
  api: '//umr.test.pajkdc.com/innerApi',
  mockApi: true
};


