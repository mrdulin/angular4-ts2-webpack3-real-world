import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';

import { IDisease } from 'root/src/models';
import { DeptService } from 'root/src/services';
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

  disease: IDisease;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: IDisease,
    private deptService: DeptService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.deptsLevel1 = this.deptService.deptsLevel1;
    this.disease = this.utilService.copy(this.data);
  }

  associate() {
    console.log(this.selectedDeptLevel1, this.selectedDeptLevel2);
    //TODO 关联科室
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}
