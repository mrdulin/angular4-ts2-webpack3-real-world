import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropertySerivce } from 'root/src/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'attr-edit',
  templateUrl: './edit.component.html'
})
export class AttrEditComponent implements OnInit {
  property: any;
  propertyValues: any[] = [];

  constructor(
    private propertyService: PropertySerivce,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.property = this.propertyService.getCurrentEditProperty();
    if (!this.property) {
      this.back();
    }
  }

  back() {
    this.router.navigate(['/tag-manager/attribute']);
  }

  addPropertyValue(inputRef: HTMLInputElement) {
    console.log('添加属性值');
    const value: string = inputRef.value.trim();
    if(!value) return;
    this.propertyValues.push(value);
    inputRef.value = '';
    //TODO: 调接口保存属性值
  }
}
