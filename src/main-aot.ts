import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModuleNgFactory } from '../compiled/aot/src/modules/app/app.module.ngfactory';

import 'zone.js/dist/zone';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

console.log('Running AOT compiled');
platformBrowser()
  .bootstrapModuleFactory(AppModuleNgFactory)
  .catch((err: any) => {
    console.log('ERROR Bootstrapping Angular 2 AOT! \n');
    console.error(err);
  });
