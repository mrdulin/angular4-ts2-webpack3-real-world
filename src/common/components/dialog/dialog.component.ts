import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tip-dialog',
  templateUrl: './dialog.component.html'
})
export class TipDialogComponent implements OnInit {
  msg: string;
  title: string;

  constructor(
    public dialogRef: MdDialogRef<TipDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.msg = this.data.msg;
  }

}
