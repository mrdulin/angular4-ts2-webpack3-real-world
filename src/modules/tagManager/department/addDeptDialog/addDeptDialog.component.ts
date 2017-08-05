import { Component, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { DeptService } from 'root/src/services';

@Component({
  selector: 'add-dept-dialog',
  templateUrl: './addDeptDialog.component.html'
})
export class AddDeptDialogComponent {

  tagName: string;
  deptLevels: number[] = [1, 2];
  selectedTagLevel: number;

  constructor(
    private dialogRef: MdDialogRef<AddDeptDialogComponent>,
    private deptService: DeptService
  ) { }

  onSubmit() {
    const dept: any = {
      tagLevel: this.selectedTagLevel,
      tagName: this.tagName
    };
    this.deptService.addDept(dept).subscribe((data) => {
      dept.tagId = data.model;
      this.dialogRef.close(dept);
    });
  }
}
