import { Component, Inject, OnInit } from '@angular/core'
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { IDiseaseCenterEntranceData } from 'root/src/interfaces'
import { IOptions } from 'root/src/common/components/checkboxGroup'
import { DiseaseHomeService } from 'root/src/services'

import { Observable } from 'rxjs';

@Component({
  selector: 'entrance-edit',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class EntranceEditComponent implements OnInit {
  entranceEditForm: FormGroup
  options: IOptions
  constructor(
    @Inject(MD_DIALOG_DATA) public formData: { record?: IDiseaseCenterEntranceData, options: IOptions },
    private fb: FormBuilder,
    private diseaseHomeService: DiseaseHomeService,
    public dialogRef: MdDialogRef<EntranceEditComponent>
  ) { }

  ngOnInit(): void {
    const { record, options } = this.formData
    if (record) {
      const { sortFactor, name, linkUrl, icon, poster, channels, id } = record;

      this.entranceEditForm = this.fb.group({
        sortFactor: sortFactor,
        name: [name, Validators.required],
        linkUrl: linkUrl,
        icon: [icon, Validators.required],
        poster: poster,
        channels: [channels, Validators.required],
        id: id
      });
    }
    this.options = options

  }

  createDialogData(): Observable<any> {
    return this.diseaseHomeService.createEntranceData(this.entranceEditForm.value)
  }

  saveEditDialogData(): Observable<any> {
    return this.diseaseHomeService.saveEntranceData(this.entranceEditForm.value)
  }

  handleSubmit(): void {
    const isEdit = this.formData.record && this.formData.record.id
    if (!isEdit) {
      this.createDialogData().subscribe((res: any) => this.dialogRef.close(this.entranceEditForm.value))
    } else {
      this.saveEditDialogData().subscribe((res: any) => this.dialogRef.close(this.entranceEditForm.value))
    }
  }
}
