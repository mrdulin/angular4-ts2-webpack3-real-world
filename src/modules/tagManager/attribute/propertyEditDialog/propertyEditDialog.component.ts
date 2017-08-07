import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { PropertySerivce } from 'root/src/services';

@Component({
  selector: 'property-edit-dialog',
  templateUrl: './propertyEditDialog.component.html'
})
export class PropertyEditDialogComponent implements OnInit {
  options: any[] = [
    { key: '1', name: '单选' },
    { key: '2', name: '多选' }
  ]
  property: any;
  selectedOption: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    private dialogRef: MdDialogRef<PropertyEditDialogComponent>,
    private propertyService: PropertySerivce
  ) {
    this.property = this.data.property;
  }

  ngOnInit() {
    // TODO: bug?
    // const choiceMap = this.data.choiceMap;
    // console.log(choiceMap.entries());
    // this.options = [...choiceMap];
    // console.log(this.options);
  }

  onSubmit(value: string) {
    const propertyName = value.trim();
    const postBody = {
      choice: this.selectedOption.key,
      propertyId: this.property.propertyId,
      propertyName,
    };

    this.propertyService.save(postBody).subscribe((data) => {
      this.dialogRef.close();
    });

  }
}
