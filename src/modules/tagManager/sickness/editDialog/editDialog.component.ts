import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

import { IDisease } from 'root/src/models';
import { DeptService, DiseaseService } from 'root/src/services';
import { UtilService } from 'common/services';

@Component({
  selector: 'edit-dialog',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class EditDialogComponent implements OnInit {
  deptsLevel1: any[] = [];
  deptsLevel2: any[] = [];
  selectedDeptLevel1: any;
  selectedDeptLevel2: any;

  deptAssiociated: any[] = [];

  disease: IDisease;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: IDisease,
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
    const dept: any = this.selectedDeptLevel2 || this.selectedDeptLevel1;
    if (!dept) return;

    const index: number = this.deptAssiociated.findIndex((item: any) => item.tagId === dept.tagId);
    const hasDept = index !== -1;
    if (hasDept) {
      const msg: string = '重复的科室无法关联';
      this.snackBar.open(msg, null, { duration: 2000 });
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
    const disease: IDisease = this.disease;
    const postBody: any = {
      aliasName: disease.aliasName,
      standardCode: disease.standardCode,
      tagId: disease.tagId,
      tagName: disease.tagName,
      relatedTags: this.deptAssiociated.map((dept: any) => ({ tagName: dept.tagName, tagId: dept.tagId }))
    };
    this.diseaseService.save(postBody).subscribe(
      () => this.dialogRef.close(),
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
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
    const tagId: number = this.selectedDeptLevel1.tagId;
    this.deptService.getDeptsByTagId(tagId).subscribe(
      (deptsLevel2: any) => this.deptsLevel2 = deptsLevel2,
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
    );
  }

  /**
   * 删除关联的科室
   *
   * @param {*} dept
   * @memberof EditDialogComponent
   */
  deleteAssociatedDept(dept: any) {
    this.deptAssiociated = this.deptAssiociated.filter((item: any) => item.tagId !== dept.tagId);
  }
}
