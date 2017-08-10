import { Component, OnInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { EntranceEdit } from './editDialog/editDialog.component';
import { EntranceService } from 'root/src/services';
import { IDiseaseCenterEntranceData } from 'root/src/models';
import { IOptions } from 'common/components/checkboxGroup';
import { IEntranceData } from 'src/services';

@Component({
  selector: 'entrance-manager',
  templateUrl: './entranceManager.component.html',
  styleUrls: ['./entranceManager.component.css']
})
export class entranceManagerComponent implements OnInit {
  entranceData: IDiseaseCenterEntranceData[]
  checkboxOptions: IOptions[]
  constructor(
    private dialog: MdDialog,
    private entranceService: EntranceService,
    private snackbar: MdSnackBar
  ){}

  ngOnInit (): void {
    this.queryChannelsInfo()
    this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
  }

  queryChannelsInfo(): void {
    this.entranceService.getChannelsData().subscribe((res: any) => {
      const { model } = res
      this.checkboxOptions = model.map((item: any) => {
        return {
          label: item.name,
          value: item.id
        }
      }) || []
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  queryEntranceInfo(data: IEntranceData) {
    this.entranceService.getEntranceData(data).subscribe((res: any) => {
      const { model } = res
      this.entranceData = model.t || []
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  editEntranceForm(record: object, options: IOptions): void{
    const dialogRef = this.dialog.open(EntranceEdit, {
      data: { record, options },
      width: '400px'
    })
    dialogRef.afterClosed().subscribe(result => {
      this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
    })
  }

  deleteEntranceForm(id: number): void {
    // TODO..confirm dialog
    // this.entranceService.deleteEntranceData(id)
  }
}
