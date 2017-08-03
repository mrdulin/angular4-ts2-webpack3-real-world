import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

import { IDisease } from 'root/src/models';

@Component({
  selector: 'config-dialog',
  templateUrl: './configDialog.component.html',
  styleUrls: ['./configDialog.component.css']
})
export class ConfigDialogComponent implements OnInit {

  disease: IDisease;
  config: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.disease = this.data.disease;
    this.config = this.data.config;
  }

  onSumit() {
    console.log(this.config);
  }

}

