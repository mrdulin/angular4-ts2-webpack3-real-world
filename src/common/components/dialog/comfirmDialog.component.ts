import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

export interface IComfirmDialog{
  title?: string
  width?: string,
  height?: string,
  msg: string,
  onConfirm?: Function,
  onConfirmText?: string,
  onCancelText?: string
}

@Component({
  selector: 'comfirm-dialog',
  templateUrl: './comfirmDialog.component.html',
  styleUrls: ['./comfirmDialog.component.css']
})
export class ComfirmDialogComponent implements OnInit {
  title?: string = '提示'
  width?: string = '400px'
  height?: string = '100px'
  msg: string
  onConfirm?: Function = () => {}
  onConfirmText?: string = '确定'
  onCancelText?: string = '取消'

  constructor(
    public dialogRef: MdDialogRef<ComfirmDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: IComfirmDialog
  ) { }

  ngOnInit() {
    const { title, width, height, msg, onConfirm, onCancelText = null, onConfirmText = null } = this.data
    this.msg = msg
    if(title) this.title = title
    if(width) this.width = width
    if(height) this.height = height
    if(onConfirm) this.onConfirm = onConfirm
    if(onConfirmText) this.onConfirmText = onConfirmText
    if(onCancelText) this.onCancelText = onCancelText
  }

  handleConfirm(): void {
    this.onConfirm()
  }
}
