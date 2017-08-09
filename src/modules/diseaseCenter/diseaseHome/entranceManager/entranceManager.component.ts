import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { EntranceEdit } from './editDialog/editDialog.component';
import { EntranceService } from 'root/src/services';
import { IDiseaseCenter } from 'root/src/models';
import { IOptions } from '../../../../common/components/checkboxGroup';

@Component({
  selector: 'entrance-manager',
  templateUrl: './entranceManager.component.html',
  styleUrls: ['./entranceManager.component.css']
})
export class entranceManagerComponent implements OnInit {
  entranceData: IDiseaseCenter[]
  checkboxOptions: IOptions[]
  constructor(
    private dialog: MdDialog,
    private entranceService: EntranceService
  ){}

  ngOnInit (): void {
    const entranceList = this.entranceService.getEntranceData()
    this.entranceData = entranceList && entranceList.model.t || []
    this.checkboxOptions = [{
      label: '寿险',
      value: 2
    }, {
      label: '平安好医生',
      value: 9
    }, {
      label: '主客',
      value: 1
    }, {
      label: 'H',
      value: 15
    }]
  }

  handleOnchange(value: number[]): void {
    console.log(value)
  }

  editEntranceForm(record: object): void{
    const dialogRef = this.dialog.open(EntranceEdit, {
      data: record,
      width: '400px'
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
}
