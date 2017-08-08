import { Injectable } from '@angular/core';
import { Settings } from '../../modules/app/app.config';

@Injectable()
export class UtilService {
  public getPublicImageUrl(tfsKey: string, size?: string): string {
    let suffix = tfsKey.substring(tfsKey.length - 4);
    if (suffix.charAt(0) === '.') {
      tfsKey = tfsKey.substring(0, tfsKey.length - 4);
      if (size) {
        tfsKey += '_' + size;
      }
      tfsKey += suffix;
    } else {
      suffix = tfsKey.substring(tfsKey.length - 5);
      if (suffix.charAt(0) === '.') {
        tfsKey = tfsKey.substring(0, tfsKey.length - 5);
        if (size) {
          tfsKey += '_' + size;
        }
        tfsKey += suffix;
      } else {
        if (size) {
          tfsKey += '_' + size;
        }
      }
    }
    return Settings.FILES_PUBLIC + '/' + tfsKey;
  }
}
