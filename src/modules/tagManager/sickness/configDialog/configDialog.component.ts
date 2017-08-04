import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { IDisease } from 'root/src/models';
import { DiseaseConfigService } from 'root/src/services';

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
    private diseaseConfigService: DiseaseConfigService,
    private dialogRef: MdDialogRef<ConfigDialogComponent>
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.disease = this.data.disease;
    this.config = this.data.config;
  }

  /**
   * @desc 保存配置设置
   * @memberof ConfigDialogComponent
   */
  onSumit() {
    console.log(this.config);
    const data: IDiseaseMainInfo & IDiseaseConfig = {
      tagId: this.disease.tagId,
      tagName: this.disease.tagName,
      ...this.config
    };

    //TODO: 保存失败异常处理
    this.diseaseConfigService.save(data).subscribe((res: any) => {
      console.log(res);
      if(res.model) {
        this.dialogRef.close();
      }
    });
  }

}

