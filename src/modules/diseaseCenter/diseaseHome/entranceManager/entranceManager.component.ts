import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { EntranceEdit } from './editDialog/editDialog.component';
import { EntranceService } from 'root/src/services';
import { IDiseaseCenter } from 'root/src/models';

@Component({
  selector: 'entrance-manager',
  templateUrl: './entranceManager.component.html',
  styleUrls: ['./entranceManager.component.css']
})
export class entranceManagerComponent{
  entranceData: IDiseaseCenter[]
  constructor(
    private dialog: MdDialog,
    private entranceService: EntranceService
  ){
    const entranceList = entranceService.getEntranceData()
    this.entranceData = entranceList && entranceList.model.t || []
  }

  editEntranceForm(record: object): void{
    const dialogRef = this.dialog.open(EntranceEdit, {
      data: record
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
}
