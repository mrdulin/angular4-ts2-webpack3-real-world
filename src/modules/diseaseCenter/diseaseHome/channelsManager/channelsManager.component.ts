import { Component, OnInit } from '@angular/core'
import { MdDialog, MdSnackBar } from '@angular/material'
import { DiseaseHomeService } from 'root/src/services'
import { ComfirmDialogService } from 'common/components/dialog'

@Component({
  selector: 'channels-manager',
  templateUrl: './channelsManager.component.html',
  styleUrls: ['./channelsManager.component.css']
})
export class ChannelsManagerComponent implements OnInit {
  chipList: object[]

  constructor(
    private dialog: MdDialog,
    private diseaseHomeService: DiseaseHomeService,
    private snackbar: MdSnackBar,
    private comfirmDialogService: ComfirmDialogService
  ){ }

  ngOnInit (): void {
    this.queryChannelsInfo()
  }

  queryChannelsInfo(): void {
    this.diseaseHomeService.getChannelsData().subscribe((res: any) => {
      const { model } = res
      this.chipList = model
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  createChip(value: string): void {
    this.diseaseHomeService.createChannelsData(value.trim()).subscribe(() => {
      this.queryChannelsInfo()
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }
 
  deleteChip(id: number): void {
    this.comfirmDialogService.open({
      msg: '你确定要删除吗？',
      onConfirm: () => this.diseaseHomeService.deleteChannelsData(id).subscribe(() => {
        this.queryChannelsInfo()
        this.comfirmDialogService.close()
      })
    })
  }
}
