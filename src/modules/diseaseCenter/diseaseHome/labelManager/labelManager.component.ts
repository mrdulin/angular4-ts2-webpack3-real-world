import { Component, OnInit } from '@angular/core'
import { MdDialog, MdSnackBar } from '@angular/material'
import { DiseaseHomeService } from 'root/src/services'
import { ComfirmDialogService } from 'common/components/dialog'

@Component({
  selector: 'label-manager',
  templateUrl: './labelManager.component.html',
  styleUrls: ['./labelManager.component.css']
})
export class LabelManagerComponent implements OnInit {
  chipList: object[]

  constructor(
    private dialog: MdDialog,
    private diseaseHomeService: DiseaseHomeService,
    private snackbar: MdSnackBar,
    private comfirmDialogService: ComfirmDialogService
  ){ }

  ngOnInit (): void {
    this.queryLabelInfo()
  }

  queryLabelInfo(): void {
    this.diseaseHomeService.getLabelData().subscribe((res: any) => {
      const { model } = res
      this.chipList = model
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  createChip(value: string): void {
    this.diseaseHomeService.createLabelData(value.trim()).subscribe(() => {
      this.queryLabelInfo()
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }
 
  deleteChip(id: number): void {
    this.comfirmDialogService.open({
      msg: '你确定要删除吗？',
      onConfirm: () => this.diseaseHomeService.deleteLabelData(id).subscribe(() => {
        this.queryLabelInfo()
        this.comfirmDialogService.close()
      })
    })
  }

  editSortFacor(chip: object): void {
    console.log(chip)
  }
}
