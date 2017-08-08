import { Injectable } from '@angular/core';
import { Settings } from '../../modules/app/app.config';

@Injectable()
export class UploadService {
  public uploadFile({
    url = Settings.FILEGW_HOST + '/upload',
    tfsGroupId = 0, //0-公有云 1-私有云
    file,
    timeout = 60000,
    maxSize = 4194304, //file不超过4M
    successCallback,
    progressCallback,
    errorCallback,
    timeoutCallback,
    overSizeCallback
  }: {
    url?: string,
    tfsGroupId?: number,
    file: any,
    timeout?: number,
    maxSize?: number,
    successCallback: Function,
    progressCallback?: Function,
    errorCallback: Function,
    timeoutCallback: Function,
    overSizeCallback: Function
  }): void {
    let xhr: XMLHttpRequest, formData: FormData;
    if (file.size <= maxSize) {
      formData = new FormData();
      formData.append('content', file);
      xhr = new XMLHttpRequest();
      xhr.open('post', url + '?tfsGroupId=' + tfsGroupId);
      xhr.withCredentials = true;
      xhr.send(formData);

      setTimeout(() => {
        if (xhr) {
          //关闭请求
          xhr.abort();
          timeoutCallback && timeoutCallback();
        }
      }, timeout);

      // 处理上传
      xhr.addEventListener('progress', function(event: any) {
        if (event.lengthComputable) {
          let percent = Math.round((event.loaded / event.total) * 100);
          progressCallback && progressCallback(percent);
        }
      });

      // 处理上传完成
      xhr.addEventListener('load', function(result: any) {
        let data;
        file = null;
        formData = null;
        xhr = null;
        try {
          data = JSON.parse(result.target.response);
          // console.log(data);
          if (Object.keys(data)
            .length !== 0) {
            for (let x in data) {
              if (data[x] == null) {
                errorCallback && errorCallback(data);
                return;
              }
            }
          } else {
            errorCallback && errorCallback(data);
            return;
          }
        } catch (e) {
          console.error(result);
          errorCallback && errorCallback(data);
          return;
        }
        successCallback && successCallback(data);
      });

      // 处理上传失败
      xhr.addEventListener('error', function(result) {
        errorCallback && errorCallback(result);
      });

    } else {
      overSizeCallback && overSizeCallback();
    }
  };

}