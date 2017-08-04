import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit {
  msg: string;
  title: string;

  constructor(
    public dialogRef: MdDialogRef<DialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.msg = this.data.msg;
  }

}
