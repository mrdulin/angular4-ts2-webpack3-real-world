import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { EntranceEditService } from 'root/src/services'

@Component({
  selector: 'entrance-edit',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class EntranceEdit{
  entranceEditForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private entranceService: EntranceEditService,
    public dialogRef: MdDialogRef<EntranceEdit>
  ){
    console.log(entranceService.getEntranceEditData())
    this.entranceEditForm = this.fb.group({
      sortFactor: ['', Validators.required],
      name: ['', Validators.required],
      linkUrl: '',
      icon: '',
      poster: '',
      channels1: '',
      channels2: '',
      channels3: '',
      channels4: ''
    });
  }

  handleIconBeforeUpload(value: any): void{
    console.log(value)
  }

  handlePosterBeforeUpload(value: any): void{
    console.log(value)
  }
}
