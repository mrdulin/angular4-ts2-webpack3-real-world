import { Component, Input, OnInit, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MdSnackBar } from '@angular/material';
import { UtilService, UploadService } from '../../services'

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UploadComponent),
    multi: true
};

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class UploadComponent implements OnInit, ControlValueAccessor{
  imgUrl: string
  fileList: any[]
  propagateChange: Function = (_: any) => {}
  @Input() beforeUpload?: Function = () => {}
  @Input() onSuccess?: Function = () => {}
  @Input() disabled?: boolean = false
  @Input() src?: string
  @Input() text?: string
  @Input() limit?: number = 1
  @Input() maxSize?: number
  @Input() timeout?: number

  constructor(
    private _utilService: UtilService, 
    private _uploadService: UploadService,
    private snackbar: MdSnackBar
  ) {}

  writeValue(value: any): void {
    if(value) {
      this.imgUrl = this._utilService.getPublicImageUrl(value)
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any) {}

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
    this.propagateChange(null)
    $inputEl.value = null
  }

  private _uploadImg(file: any): void {
    if (this.limit > 1 && file.length >= this.limit) {
      alert(`最多上传${this.limit}张图片`);
      return;
    }
    this.beforeUpload(file)
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
            this.propagateChange(this.fileList[0].uid)
            this.onSuccess(this.fileList[0])
          }
        },
        errorCallback: (data: any) => {
          console.log(data);
          this.snackbar.open('上传失败', null, { duration: 2000 })
        },
        timeoutCallback: (data: any) => {
          console.log(data);
          this.snackbar.open('上传失败, 请求超时', null, { duration: 2000 })
        },
        overSizeCallback: (data: any) => {
          console.log(data);
          this.snackbar.open('上传失败, 超过最大尺寸', null, { duration: 2000 })
        }
      }, {})
      this._uploadService.uploadFile(uploadConfig);
    }
  }
}
