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

  addAssociateDept() {
    //TODO 关联科室
    const dept: any = this.selectedDeptLevel2 || this.selectedDeptLevel1;
    if(!dept) return;

    const index: number = this.deptAssiociated.findIndex((item: any) => item.tagId === dept.tagId);
    const hasDept = index !== -1;
    if (hasDept) {
      const msg: string = '重复的科室无法关联';
      this.snackBar.open(msg, null, {
        duration: 1000
      });
      return;
    }
    this.deptAssiociated.push(dept);
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    const disease: IDisease = this.disease;
    const postBody: any = {
      aliasName: disease.aliasName,
      standardCode: disease.standardCode,
      tagId: disease.tagId,
      tagName: disease.tagName,
      relatedTags: this.deptAssiociated.map((dept: any) => ({ tagName: dept.tagName, tagId: dept.tagId }))
    };
    this.diseaseService.save(postBody).subscribe(
      (data: any) => this.dialogRef.close(),
      (err: any) => this.snackBar.open(err)
    )
  }

  onDeptLevel1Changed($event: any) {
    console.log(this.selectedDeptLevel1);
    const tagId: number = this.selectedDeptLevel1.tagId;
    this.deptService.getDeptsByTagId(tagId).subscribe(
      (deptsLevel2: any) => {
        this.deptsLevel2 = deptsLevel2;
      },
      (err: any) => {
        //TODO 异常处理
        console.error(err);
      }
    );
  }

  deleteAssociatedDept(dept: any) {
    this.deptAssiociated = this.deptAssiociated.filter((item: any) => item.tagId !== dept.tagId);
  }
}
