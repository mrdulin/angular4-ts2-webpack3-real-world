import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

export interface IComfirmDialog{

}

@Component({
  selector: 'comfirm-dialog',
  templateUrl: './comfirmDialog.component.html'
})
export class ComfirmDialogComponent implements OnInit {
  msg: string;
  title: string;

  constructor(
    public dialogRef: MdDialogRef<ComfirmDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.msg = this.data.msg;
  }

}
