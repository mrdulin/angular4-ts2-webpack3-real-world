import { Component, Inject } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';

import { DeptService } from 'root/src/services';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

@Component({
  selector: 'add-dept-dialog',
  templateUrl: './addDeptDialog.component.html'
})
export class AddDeptDialogComponent {

  tagName: string;
  deptLevels: number[] = [1, 2];
  selectedTagLevel: number;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
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
        this.snackBar.open('新增科室成功！', null, this.appConfig.mdSnackBarConfig);
        this.dialogRef.close(data);
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
    );
  }
}
