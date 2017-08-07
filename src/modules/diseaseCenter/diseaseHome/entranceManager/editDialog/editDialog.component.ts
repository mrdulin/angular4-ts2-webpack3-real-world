import { Component, Inject } from '@angular/core'
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { IDiseaseCenter } from 'root/src/models'
import { EntranceEditService } from 'root/src/services'

@Component({
  selector: 'entrance-edit',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class EntranceEdit{
  entranceEditForm: FormGroup
  constructor(
    @Inject(MD_DIALOG_DATA) public formData: IDiseaseCenter,
    private fb: FormBuilder,
    private entranceService: EntranceEditService,
    public dialogRef: MdDialogRef<EntranceEdit>
  ){
    console.log(entranceService.getEntranceEditData(), this.formData)
    const { sortFactor, name, linkUrl, icon, poster, channels } = this.formData
    this.entranceEditForm = this.fb.group({
      sortFactor: [sortFactor, Validators.required],
      name: [name, Validators.required],
      linkUrl: linkUrl,
      icon: icon,
      poster: poster,
      channels1: channels,
      channels2: channels,
      channels3: channels,
      channels4: channels
    });
  }

  handleIconBeforeUpload(value: any): void{
    console.log(value)
  }

  handlePosterBeforeUpload(value: any): void{
    console.log(value)
  }
}
