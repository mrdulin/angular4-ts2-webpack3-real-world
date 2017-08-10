import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdSnackBar, MdDialogRef } from '@angular/material';

import { DeptService } from 'root/src/services';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

@Component({
  selector: 'dept-edit-dialog',
  templateUrl: './deptEditDialog.component.html'
})
export class DeptEditDialogComponent implements OnInit {

  tagName: string;
  icon: string;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    @Inject(MD_DIALOG_DATA) public dept: any,
    private deptService: DeptService,
    private snackBar: MdSnackBar,
    private dialogRef: MdDialogRef<DeptEditDialogComponent>
  ) {
  }

  ngOnInit() {
    this.tagName = this.dept.tagName;
    this.icon = this.dept.icon;
  }

  /**
   * 保存科室信息修改
   *
   * @memberof DeptEditDialogComponent
   */
  onSubmit() {
    const { tagId, parentName } = this.dept;
    const { icon, tagName } = this;

    const postBody: any = { icon, tagId, tagName, parentName };

    this.deptService.save(postBody).subscribe(
      (data: any) => {
        this.snackBar.open('编辑成功!', null, this.appConfig.mdSnackBarConfig);
        this.dialogRef.close(data)
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
    );
  }

}
