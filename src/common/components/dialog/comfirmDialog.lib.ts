import { Injectable } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { ComfirmDialogComponent, IComfirmDialog } from './comfirmDialog.component'

@Injectable()
export class ComfirmDialogService{
  dialogRef: MdDialogRef<ComfirmDialogComponent>
  constructor(private _dialog: MdDialog){}

  public open(config: IComfirmDialog): void {
    this.dialogRef = this._dialog.open(ComfirmDialogComponent, {
      data: config
    })
  }

  public close(): void {
    this.dialogRef.close()
  }
}