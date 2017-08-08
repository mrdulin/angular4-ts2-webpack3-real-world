import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig {
  api: string;
  mockApi: boolean;
  LOGIN_HOST: string;
  APP_ID: string;
}

interface ISettings {
  WEBLOGIN_HOST: string,
  FILES_PUBLIC: string,
  FILEGW_HOST: string,
  AREA_URL: string,
  CAMEL_HOST: string,
  UMR_HOST: string
}

export const AppConfig: IAppConfig = {
  api: '//umr.test.pajkdc.com/innerApi',

  //全局mock开关，true, 使用本地json，false，走http请求
  mockApi: false,

  //单点登陆域名
  LOGIN_HOST: '//test.pajkdc.com',

  APP_ID: '9002'
};

const isTestHost = (location.href.indexOf('test.pajkdc.com') !== -1);
export const Settings: ISettings = isTestHost ? {
  WEBLOGIN_HOST: 'http://test.pajkdc.com',
  FILES_PUBLIC: 'http://static.test.pajkdc.com/v1/tfs',
  FILEGW_HOST: 'http://filegw.test.pajkdc.com',
  AREA_URL: 'http://www.test.pajkdc.com/resource/areaData.json',
  CAMEL_HOST: 'http://camel.test.pajkdc.com/areadata',
  UMR_HOST: 'http://umr.test.pajkdc.com'
} : {
  WEBLOGIN_HOST: 'http://dev.pajkdc.com',
  FILES_PUBLIC: 'http://static.dev.pajkdc.com/v1/tfs',
  FILEGW_HOST: 'http://filegw.dev.pajkdc.com',
  AREA_URL: 'http://www.dev.pajkdc.com/resource/areaData.json',
  CAMEL_HOST: 'http://camel.dev.pajkdc.com/areadata',
  UMR_HOST: 'http://umr.dev.pajkdc.com'
};
