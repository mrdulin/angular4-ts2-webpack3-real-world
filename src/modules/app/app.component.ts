import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeptService } from 'root/src/services';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private deptService: DeptService
  ) { }

  ngOnInit() {
    const tagLevel: number = 1;
    this.deptService.getDeptsByTagLevel(tagLevel);
  }
}
