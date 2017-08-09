import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';

import { IDisease } from 'root/src/models';
import { DiseaseService } from 'root/src/services';

import { IDiseaseConfig, IDiseaseMainInfo } from 'root/src/models';

@Component({
  selector: 'config-dialog',
  templateUrl: './configDialog.component.html',
  styleUrls: ['./configDialog.component.css']
})
export class ConfigDialogComponent implements OnInit {

  disease: IDisease;
  config: IDiseaseConfig;

  constructor(
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
    const data: IDiseaseMainInfo & IDiseaseConfig = {
      tagId: this.disease.tagId,
      tagName: this.disease.tagName,
      ...this.config
    };

    this.diseaseService.saveConfig(data).subscribe(
      () => {
        this.snackBar.open('编辑疾病配置成功！', null, { duration: 2000 });
        this.dialogRef.close();
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
    );
  }

}

