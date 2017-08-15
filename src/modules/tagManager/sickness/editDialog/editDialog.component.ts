import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

import {
  IDisease,
  IDiseaseSavePostBody,
  IDiseaseTagBase,
  IDiseaseTagWithChildren,
  IApiResponse
} from 'root/src/interfaces';
import { DeptService, DiseaseService } from 'root/src/services';
import { UtilService } from 'common/services';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

@Component({
  selector: 'edit-dialog',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class EditDialogComponent implements OnInit {
  deptsLevel1: IDiseaseTagWithChildren[] = [];
  deptsLevel2: IDiseaseTagWithChildren[] = [];
  selectedDeptLevel1: IDiseaseTagWithChildren;
  selectedDeptLevel2: IDiseaseTagWithChildren;

  deptAssiociated: IDiseaseTagWithChildren[] = [];
  disease: IDisease<IDiseaseTagWithChildren>;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    @Inject(MD_DIALOG_DATA) public data: IDisease<IDiseaseTagWithChildren>,
    private deptService: DeptService,
    private utilService: UtilService,
    private diseaseService: DiseaseService,
    private dialogRef: MdDialogRef<EditDialogComponent>,
    private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.deptsLevel1 = this.deptService.deptsLevel1;
    this.disease = this.utilService.copy(this.data);
    this.deptAssiociated = this.disease.relatedTags;
  }

  /**
   * 关联一级或二级科室
   *
   * @returns
   * @memberof EditDialogComponent
   */
  addAssociateDept() {
    const dept: IDiseaseTagWithChildren = this.selectedDeptLevel2 || this.selectedDeptLevel1;
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
   * 保存疾病信息修改
   *
   * @param {NgForm} form
   * @memberof EditDialogComponent
   */
  onSubmit(form: NgForm) {
    const disease: IDisease<IDiseaseTagWithChildren> = this.disease;
    const postBody: IDiseaseSavePostBody = {
      aliasName: disease.aliasName,
      standardCode: disease.standardCode,
      tagId: disease.tagId,
      tagName: disease.tagName,
      relatedTags: this.deptAssiociated.map(({ tagName, tagId }: IDiseaseTagBase): IDiseaseTagBase => ({ tagName, tagId }))
    };
    this.diseaseService.save(postBody).subscribe(
      (data: IApiResponse<boolean>): void => {
        this.snackBar.open('编辑成功！', null, this.appConfig.mdSnackBarConfig);
        this.dialogRef.close(data);
      },
      (errMsg: string): void => { this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig) }
    )
  }

  /**
   * 选择一级科室change事件处理函数
   * 根据选择的一级科室tagId查找二级科室
   *
   * @param {*} $event
   * @memberof EditDialogComponent
   */
  onDeptLevel1Changed($event: any) {
    const tagId: string = this.selectedDeptLevel1.tagId;
    this.deptService.getDeptsByTagId(tagId).subscribe(
      (deptsLevel2: IDiseaseTagWithChildren[]): void => { this.deptsLevel2 = deptsLevel2 },
      (errMsg: string): void => { this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig) }
    );
  }

  /**
   * 删除关联的科室
   *
   * @param {IDiseaseTagWithChildren} dept
   * @memberof EditDialogComponent
   */
  deleteAssociatedDept(dept: IDiseaseTagWithChildren) {
    this.deptAssiociated = this.deptAssiociated.filter((item: IDiseaseTagWithChildren): boolean => item.tagId !== dept.tagId);
  }
}
