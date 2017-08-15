import { Component, OnInit, ViewChild } from '@angular/core'
import { MdDialog, MdSnackBar, MdPaginator, PageEvent } from '@angular/material'
import { EntranceEditComponent } from './editDialog/editDialog.component'
import { EntranceService } from 'root/src/services'
import { IDiseaseCenterEntranceData } from 'root/src/interfaces'
import { IOptions } from 'common/components/checkboxGroup'
import { ComfirmDialogService } from 'common/components/dialog';
import { IEntranceData } from 'src/services'
import { PaginatorService } from 'common/services'

@Component({
  selector: 'entrance-manager',
  templateUrl: './entranceManager.component.html',
  styleUrls: ['./entranceManager.component.css']
})
export class entranceManagerComponent implements OnInit {
  entranceData: IDiseaseCenterEntranceData[]
  checkboxOptions: IOptions[]
  pageIndex: number
  pageSize: number
  pageSizeOptions: number[]
  totalCount: number = 0

  
  @ViewChild(MdPaginator)
  paginator: MdPaginator

  constructor(
    private dialog: MdDialog,
    private entranceService: EntranceService,
    private snackbar: MdSnackBar,
    private comfirmDialogService: ComfirmDialogService,
    private paginatorService: PaginatorService
  ){
    const { pageIndex, pageSize, pageSizeOptions } = this.paginatorService
    
    this.pageIndex = pageIndex
    this.pageSize = pageSize
    this.pageSizeOptions = pageSizeOptions
  }

  ngOnInit (): void {
    this.queryChannelsInfo()
    this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
    this.paginatorService.i18n(this.paginator, 'cn')
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
    this.pageIndex = data.pageNo
    this.entranceService.getEntranceData(data).subscribe((res: any) => {
      const { model } = res
      this.entranceData = model.t || []
      this.totalCount = model.count
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  editEntranceForm(record: object, options: IOptions): void{
    const dialogRef = this.dialog.open(EntranceEditComponent, {
      data: { record, options },
      width: '400px'
    })
    dialogRef.afterClosed().subscribe(result => {
      this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
    })
  }

  deleteEntranceForm(id: number): void {
    this.comfirmDialogService.open({
      msg: '你确定要删除吗？',
      onConfirm: () => this.entranceService.deleteEntranceData(id).subscribe(() => {
        this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
        this.comfirmDialogService.close()
      })
    })
  }

  handlePageChange(e: PageEvent): void {
    const pageIndex: number = e.pageIndex + 1
    this.queryEntranceInfo({ pageNo: pageIndex, pageSize: this.pageSize })
  }
}
