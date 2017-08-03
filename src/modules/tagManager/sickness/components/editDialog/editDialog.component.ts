import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

import { IDisease } from '../../models/disease.model';

import { DeptService } from 'root/src/services';

@Component({
  selector: 'edit-dialog',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class EditDialogComponent implements OnInit {
  deptsLevel1: any[] = [];
  deptsLevel2: any[] = [];

  constructor(
    @Inject(MD_DIALOG_DATA) public disease: IDisease,
    private deptService: DeptService
  ) { }

  ngOnInit() {
    console.log(this.disease);
    this.deptsLevel1 = this.deptService.getDeptsByTagLevel(1);
  }
}
