import { Component, Input, OnInit } from '@angular/core';
import { UtilService, UploadService } from '../../services'

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class uploadComponent implements OnInit{
  imgUrl: string
  fileList: any[]
  @Input() beforeUpload?: Function = () => {}
  @Input() disabled?: boolean = false
  @Input() src?: string
  @Input() text?: string
  @Input() limit?: number = 1
  @Input() maxSize?: number
  @Input() timeout?: number

  constructor(private _utilService: UtilService, private _uploadService: UploadService) {}

  ngOnInit(): void {
    this.imgUrl = this.src ? this._utilService.getPublicImageUrl(this.src) : null
  }

  handleClick($inputEl: any): void {
    $inputEl.click()
  }

  handleOnChange($inputEl: HTMLInputElement): void {
    this._uploadImg($inputEl.files[0])
    
    $inputEl.value = null
  }

  handleDelete($inputEl: any): void {
    this.imgUrl = null
    $inputEl.value = null
  }

  private _uploadImg(file: any): void {
    if (this.limit > 1 && file.length >= this.limit) {
      alert(`最多上传${this.limit}张图片`);
      return;
    }
    if (file) {
      let uploadConfig = Object.assign({
        file: file,
        maxSize: this.maxSize,
        timeout: this.timeout,
        successCallback: (data: any) => {
          if (data) {
            const tfsKey = data[Object.keys(data)[0]]
            const  item = {
              uid: tfsKey,
              name: tfsKey,
              status: 'done',
              url: this._utilService.getPublicImageUrl(tfsKey),
              thumbUrl: this._utilService.getPublicImageUrl(tfsKey, '80x80')
            }
            if (this.limit <= 1) {
              this.fileList = [item];
            } else {
              this.fileList.push(item)
            }
            this.imgUrl = this.fileList[0].thumbUrl
            this.beforeUpload(this.fileList[0])
          }
        },
        errorCallback: (data: any) => {
          console.log(data);
          console.log('上传失败');
        },
        timeoutCallback: (data: any) => {
          console.log(data);
          console.log('上传失败, 请求超时');
        },
        overSizeCallback: (data: any) => {
          console.log(data);
          console.log('上传失败, 超过最大尺寸')
        }
      }, {})
      this._uploadService.uploadFile(uploadConfig);
    }
  }
}
