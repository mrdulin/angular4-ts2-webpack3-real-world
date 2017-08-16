import { Component, Inject, OnInit } from '@angular/core'
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { IDiseaseCenterServiceData } from 'root/src/interfaces'
import { DiseaseHomeService } from 'root/src/services'

import { Observable } from 'rxjs';

@Component({
  selector: 'entrance-edit',
  templateUrl: './editDialog.component.html',
  styleUrls: ['./editDialog.component.css']
})
export class ServiceEditComponent implements OnInit{
  serviceEditForm: FormGroup
  constructor(
    @Inject(MD_DIALOG_DATA) public formData: { record?: IDiseaseCenterServiceData },
    private fb: FormBuilder,
    private diseaseHomeService: DiseaseHomeService,
    public dialogRef: MdDialogRef<ServiceEditComponent>
  ){}

  ngOnInit(): void {
    const { record: { sortFactor, linkUrl, icon, name, id } } = this.formData
    this.serviceEditForm = this.fb.group({
      sortFactor: [sortFactor, Validators.required],
      linkUrl: [linkUrl, Validators.required],
      name: [name, Validators.required],
      icon: [icon, Validators.required],
      id: id
    });
  }

  createDialogData(): Observable<any> {
    return this.diseaseHomeService.createServiceData(this.serviceEditForm.value)
  }

  saveEditDialogData(): Observable<any> {
    return this.diseaseHomeService.saveServiceData(this.serviceEditForm.value)
  }

  handleSubmit(): void {
    const isEdit = this.formData.record && this.formData.record.id
    if (!isEdit) {
      this.createDialogData().subscribe((res: any) => this.dialogRef.close(this.serviceEditForm.value))
    } else {
      this.saveEditDialogData().subscribe((res: any) => this.dialogRef.close(this.serviceEditForm.value))
    }
  }
}
