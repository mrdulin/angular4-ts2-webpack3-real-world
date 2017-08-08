import { Component, Input } from '@angular/core';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class uploadComponent{
  imgUrl: string
  @Input() beforeUpload: Function
  @Input() disabled: boolean
  @Input() src?: string
  @Input() text?: string

  getImgUrl(src: string): any {
    const imgSrc = this.src ? `http://static.test.pajkdc.com/v1/tfs//${this.src}` : ''
    return imgSrc
  }

  handleClick($inputEl: any): void {
    $inputEl.click()
  }

  handleOnChange($inputEl: any): void {
    this.beforeUpload($inputEl)
  }

  handleDelete($inputEl: any): void {
    $inputEl.value = null
    this.handleOnChange($inputEl)
  }
}
