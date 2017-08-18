import { Component, OnInit, ViewChild } from '@angular/core'
import { MdDialog, MdSnackBar, MdPaginator, PageEvent } from '@angular/material'
import { EntranceEditComponent } from './editDialog/editDialog.component'
import { DiseaseHomeService } from 'root/src/services'
import { IDiseaseCenterEntranceData } from 'root/src/interfaces'
import { IOptions } from 'common/components/checkboxGroup'
import { ComfirmDialogService } from 'common/components/dialog'
import { IEntranceData } from 'src/services'
import { PaginatorService, UtilService } from 'common/services'
import { IQueryType, ITableHeader } from 'common/interfaces'
import { DataSource } from '@angular/cdk'
import { Observable } from 'rxjs/Observable'
import { EntranceDataSource } from './entrance-data-source'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'entrance-manager',
  templateUrl: './entranceManager.component.html',
  styleUrls: ['./entranceManager.component.css']
})
export class EntranceManagerComponent implements OnInit {
  entranceDataSource: EntranceDataSource = new EntranceDataSource(this.diseaseHomeService)
  checkboxOptions: IOptions[]
  tableHeaders: ITableHeader[] = [
    { key: 'sortFactor', name: '排序', cell: (row: any) => row.sortFactor },
    { key: 'name', name: '名称', cell: (row: any) => row.name },
    { key: 'url', name: 'URL', cell: (row: any) => this.transferToLink(row.linkUrl) },
    { key: 'icon', name: '图标', cell: (row: any) => this.renderImageHtml(row.icon) },
    { key: 'poster', name: '封面', cell: (row: any) => this.renderImageHtml(row.poster) },
    { key: 'channels', name: '渠道', cell: (row: any) => this.transfer(row.channels) },
    { key: 'operator', name: '操作', cell: (row: any) => {} }
  ]
  displayedColumns: string[] = []
  pageIndex: number
  pageSize: number
  pageSizeOptions: number[]
  totalCount: number = 0

  
  @ViewChild(MdPaginator)
  paginator: MdPaginator

  constructor(
    private dialog: MdDialog,
    private diseaseHomeService: DiseaseHomeService,
    private snackbar: MdSnackBar,
    private comfirmDialogService: ComfirmDialogService,
    private paginatorService: PaginatorService,
    private domSanitizer: DomSanitizer,
    private utilService: UtilService
  ){
    const { pageIndex, pageSize, pageSizeOptions } = this.paginatorService
    
    this.pageIndex = pageIndex
    this.pageSize = pageSize
    this.pageSizeOptions = pageSizeOptions
  }

  ngOnInit (): void {
    this.displayedColumns = this.tableHeaders.map((header: ITableHeader): string => header.key)
    this.queryChannelsInfo()
    this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
    this.paginatorService.i18n(this.paginator, 'cn')
  }

  transferToLink(url: any): SafeHtml {
    if (!url) {
      return null
    }
    return this.domSanitizer.bypassSecurityTrustHtml(`<a href="${url}" target="_blank">${url}</a>`)
  }

  renderImageHtml(src: any): SafeHtml {
    const imgUrl: string = src && this.utilService.getPublicImageUrl(src) || null
    if (!imgUrl) {
      return null
    }
    return this.domSanitizer.bypassSecurityTrustHtml(`
      <div class="imgbox" style="height: 60px;">
        <img 
          style="max-height: 60px;max-width: 100%;position: absolute;
          top: 50%;left: 50%;transform: translate(-50%, -50%);" src="${imgUrl}" /></div>
    `)
  }

  transfer(values: number[]): string{
    return values.map(value => {
      return this.checkboxOptions.find(item => item.value === value).label
    }).join(',')
  }

  queryChannelsInfo(): void {
    this.diseaseHomeService.getChannelsData().subscribe((res: any) => {
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
    this.entranceDataSource.queryEntranceInfo(data).subscribe(
    () => {
      this.totalCount = this.entranceDataSource.dataTotal
    },
    (err: string) => this.snackbar.open(err, null, { duration: 2000 }))
  }

  editEntranceForm(record: object, options: IOptions[]): void{
    const dialogRef = this.dialog.open(EntranceEditComponent, {
      data: { record, options },
      width: '400px'
    })
    dialogRef.afterClosed().subscribe(() => {
      this.queryEntranceInfo({ pageNo: 1, pageSize: 10 })
    })
  }

  deleteEntranceForm(id: number): void {
    this.comfirmDialogService.open({
      msg: '你确定要删除吗？',
      onConfirm: () => this.diseaseHomeService.deleteEntranceData(id).subscribe(() => {
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
