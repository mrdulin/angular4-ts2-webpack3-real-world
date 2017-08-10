import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';

import { PropertySerivce } from 'root/src/services';
import { APP_CONFIG, IAppConfig } from 'app/app.config';

@Component({
  selector: 'property-edit-dialog',
  templateUrl: './propertyEditDialog.component.html'
})
export class PropertyEditDialogComponent implements OnInit {
  options: any[] = [
    { key: '1', name: '单选' },
    { key: '2', name: '多选' }
  ]
  selectedOption: any;
  propertyName: string;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    @Inject(MD_DIALOG_DATA) public data: any,
    private dialogRef: MdDialogRef<PropertyEditDialogComponent>,
    private propertyService: PropertySerivce,
    private snackBar: MdSnackBar
  ) {
    this.propertyName = this.data.property.propertyName;
  }

  ngOnInit() {
    // TODO: bug?
    // const choiceMap = this.data.choiceMap;
    // console.log(choiceMap.entries());
    // this.options = [...choiceMap];
    // console.log(this.options);
  }

  onSubmit(value: string) {
    const postBody = {
      choice: this.selectedOption.key,
      propertyId: this.data.property.propertyId,
      propertyName: this.propertyName
    };

    this.propertyService.save(postBody, 'edit-prop').subscribe(
      (data) => {
        this.snackBar.open('编辑成功！', null, this.appConfig.mdSnackBarConfig);
        this.dialogRef.close(data);
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
    );

  }
}
