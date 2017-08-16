import { Component, OnInit, ViewChild } from '@angular/core'
import { MdDialog, MdSnackBar, MdPaginator, PageEvent } from '@angular/material'
import { ServiceEditComponent } from './editDialog/editDialog.component'
import { DiseaseHomeService } from 'root/src/services'
import { IDiseaseCenterServiceData } from 'root/src/interfaces'
import { IOptions } from 'common/components/checkboxGroup'
import { ComfirmDialogService } from 'common/components/dialog'
import { PaginatorService } from 'common/services'

@Component({
  selector: 'service-manager',
  templateUrl: './serviceManager.component.html',
  styleUrls: ['./serviceManager.component.css']
})
export class ServiceManagerComponent implements OnInit {
  serviceData: IDiseaseCenterServiceData[]

  constructor(
    private dialog: MdDialog,
    private diseaseHomeService: DiseaseHomeService,
    private snackbar: MdSnackBar,
    private comfirmDialogService: ComfirmDialogService
  ){ }

  ngOnInit (): void {
    this.queryServiceInfo()
  }

  queryServiceInfo() {
    this.diseaseHomeService.getServiceData().subscribe((res: any) => {
      const { model } = res
      this.serviceData = model || []
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  editServiceForm(record: object): void{
    const dialogRef = this.dialog.open(ServiceEditComponent, {
      data: { record },
      width: '400px'
    })
    dialogRef.afterClosed().subscribe(() => {
      this.queryServiceInfo()
    })
  }

  deleteServiceForm(id: number): void {
    this.comfirmDialogService.open({
      msg: '你确定要删除吗？',
      onConfirm: () => this.diseaseHomeService.deleteServiceData(id).subscribe(() => {
        this.queryServiceInfo()
        this.comfirmDialogService.close()
      })
    })
  }
}
