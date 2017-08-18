import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DeptService, DiseaseService } from 'root/src/services';
import { APP_CONFIG, IAppConfig } from 'app/app.config';
import { IDiseaseSavePostBody } from 'root/src/interfaces';

import {
  IDisease,
  IDiseaseTagBase,
  IDiseaseTagWithChildren,
  IApiResponse
} from 'root/src/interfaces';

@Component({
  selector: 'create-dialog',
  templateUrl: './create-dialog.component.html'
})
export class CreateDialogComponent implements OnInit {

  tagLevelOptions: string[] = ['1', '2', '3'];

  deptsLevel1: IDiseaseTagWithChildren[] = [];
  deptsLevel2: IDiseaseTagWithChildren[] = [];
  deptAssiociated: IDiseaseTagWithChildren[] = [];

  diseaseForm: FormGroup;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private dialogRef: MdDialogRef<CreateDialogComponent>,
    private deptService: DeptService,
    private formBuilder: FormBuilder,
    private diseaseService: DiseaseService,
    private snackBar: MdSnackBar
  ) { }

  onSubmit() {
    console.log(this.diseaseForm);
    if (this.diseaseForm.valid) {
      const { deptLv1, deptLv2, ...rest } = this.diseaseForm.value;
      const postBody: IDiseaseSavePostBody = {
        ...rest,
        relatedTags: this.deptAssiociated.map(({ tagName, tagId }: IDiseaseTagBase): IDiseaseTagBase => ({ tagName, tagId }))
      };
      this.diseaseService.save(postBody).subscribe(
        (data) => {
          this.snackBar.open('新增疾病成功!', null, this.appConfig.mdSnackBarConfig);
          this.dialogRef.close(data);
        },
        (errMsg: string) => { this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig); }
      )
    }
  }

  ngOnInit() {
    this.deptsLevel1 = this.deptService.deptsLevel1;

    this.diseaseForm = this.formBuilder.group({
      tagName: ['', [Validators.required]],
      aliasName: [''],
      standardCode: [''],
      extraCode: [''],
      tagLevel: ['', [Validators.required]],
      deptLv1: [''],
      deptLv2: ['']
    });

  }

  /**
   * 关联一级或二级科室
   *
   * @returns
   * @memberof EditDialogComponent
   */
  addAssociateDept() {
    const { deptLv1, deptLv2 } = this.diseaseForm.value;
    const dept: IDiseaseTagWithChildren = deptLv1 || deptLv2;
    if (!dept) return;

    const index: number = this.deptAssiociated
      .findIndex((item: IDiseaseTagWithChildren): boolean => item.tagId === dept.tagId);

    const hasDept: boolean = index !== -1;
    if (hasDept) {
      const msg: string = '重复的科室无法关联';
      this.snackBar.open(msg, null, this.appConfig.mdSnackBarConfig);
      return;
    }
    this.deptAssiociated.push(dept);
  }

  /**
   * 选择一级科室change事件处理函数
   * 根据选择的一级科室tagId查找二级科室
   *
   * @param {*} $event
   * @memberof EditDialogComponent
   */
  onDeptLevel1Changed($event: any) {
    const tagId: string = this.diseaseForm.value.deptLv1.tagId;
    this.deptService.getDeptsByTagId(tagId).subscribe(
      (deptsLevel2: IDiseaseTagWithChildren[]): void => { this.deptsLevel2 = deptsLevel2 },
      (errMsg: string): void => { this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig) }
    );
  }
}
