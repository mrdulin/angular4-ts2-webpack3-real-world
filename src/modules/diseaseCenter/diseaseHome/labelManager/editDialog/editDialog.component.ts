import { Component, Inject, OnInit } from '@angular/core'
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { IDiseaseCenterLabelData } from 'root/src/interfaces'
import { DiseaseHomeService } from 'root/src/services'

import { Observable } from 'rxjs'

@Component({
  selector: 'label-edit',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class LabelEditComponent implements OnInit {
  labelEditForm: FormGroup
  constructor(
    @Inject(MD_DIALOG_DATA) public formData: { record?: IDiseaseCenterLabelData },
    private fb: FormBuilder,
    private diseaseHomeService: DiseaseHomeService,
    public dialogRef: MdDialogRef<LabelEditComponent>
  ) { }

  ngOnInit(): void {
    const { record } = this.formData
    if (record) {
      const { sortFactor, name, id } = record

      this.labelEditForm = this.fb.group({
        sortFactor: sortFactor,
        name: [{ value: name, disabled: true }],
        id: id
      })
    }
  }

  updateSortFactor(): Observable<any> {
    return this.diseaseHomeService.updateSortFactor(this.labelEditForm.value)
  }

  handleSubmit(): void {
    this.updateSortFactor().subscribe((res: any) => this.dialogRef.close(this.labelEditForm.value))
  }
}
