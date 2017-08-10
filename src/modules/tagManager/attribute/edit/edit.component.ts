import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { PropertySerivce } from 'root/src/services';
import { UtilService } from 'common/services';

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
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.property = this.propertyService.getCurrentEditProperty();
    if (!this.property) {
      this.back();
      return;
    }
    this.propertyValues = this.utilService.copy(this.property.propertyValues);
  }

  back() {
    this.router.navigate(['/tag-manager/attribute']);
  }

  /**
   * 添加属性值
   *
   * @param {HTMLInputElement} inputRef
   * @returns
   * @memberof AttrEditComponent
   */
  addPropertyValue(inputRef: HTMLInputElement) {
    const value: string = inputRef.value.trim();
    if (!value) return;
    const { propertyValues, ...rest } = this.property;
    const p = { propertyValue: value };
    const postBody: any = {
      propertyValues: [p, ...this.propertyValues],
      ...rest
    };

    this.propertyService.save(postBody, 'add-prop-val').subscribe(
      () => {
        this.snackBar.open('添加属性值成功', null, { duration: 2000 });
        this.propertyValues.push(p);
        inputRef.value = '';
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
    );
  }

  /**
   * 删除属性值
   *
   * @param {*} prop
   * @memberof AttrEditComponent
   */
  delPropertyValue(prop: any) {
    const pValues = this.propertyValues.filter((p) => p.propertyValue !== prop.propertyValue);
    const { propertyValues, ...rest } = this.property;
    const postBody: any = {
      propertyValues: pValues,
      ...rest
    };
    this.propertyService.save(postBody, 'del-prop-val').subscribe(
      () => {
        this.propertyValues = pValues;
        this.snackBar.open('删除属性值成功！', null, { duration: 2000 });
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, { duration: 2000 })
    );
  }
}
