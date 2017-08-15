import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';

import {
  IDisease,
  IDiseaseConfig,
  IDiseaseTagName,
  IDiseaseTagWithChildren,
  IApiResponse
} from 'root/src/interfaces';
import { DiseaseService } from 'root/src/services';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

@Component({
  selector: 'config-dialog',
  templateUrl: './configDialog.component.html',
  styleUrls: ['./configDialog.component.css']
})
export class ConfigDialogComponent implements OnInit {

  disease: IDisease<IDiseaseTagWithChildren>;
  config: IDiseaseConfig;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    @Inject(MD_DIALOG_DATA) public data: any,
    private diseaseService: DiseaseService,
    private dialogRef: MdDialogRef<ConfigDialogComponent>,
    private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.disease = this.data.disease;
    this.config = this.data.config;
  }

  /**
   * @desc 保存配置设置
   * @memberof ConfigDialogComponent
   */
  onSumit() {
    const data: IDiseaseTagName & IDiseaseConfig = {
      tagId: this.disease.tagId,
      tagName: this.disease.tagName,
      ...this.config
    };

    this.diseaseService.saveConfig(data).subscribe(
      (apiRes: IApiResponse<boolean>): void => {
        this.snackBar.open('编辑疾病配置成功！', null, this.appConfig.mdSnackBarConfig);
        this.dialogRef.close(apiRes);
      },
      (errMsg: string): void => { this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig) }
    );
  }

}

