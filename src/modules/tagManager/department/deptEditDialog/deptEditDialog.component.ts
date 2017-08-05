import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dept-edit-dialog',
  templateUrl: './deptEditDialog.component.html'
})
export class DeptEditDialogComponent {

  constructor(
    @Inject(MD_DIALOG_DATA) public dept: any
  ) {
  }

}
