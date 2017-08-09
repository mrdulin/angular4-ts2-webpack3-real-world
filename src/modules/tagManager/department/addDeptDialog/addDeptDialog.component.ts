import { Component, Inject } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';

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
    private deptService: DeptService,
    private snackBar: MdSnackBar
  ) { }

  onSubmit() {
    const dept: any = {
      tagLevel: this.selectedTagLevel,
      tagName: this.tagName
    };
    this.deptService.addDept(dept).subscribe(
      (data: any) => {
        this.snackBar.open('新增科室成功！', null, {duration: 2000});
        this.dialogRef.close(data);
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
    );
  }
}
