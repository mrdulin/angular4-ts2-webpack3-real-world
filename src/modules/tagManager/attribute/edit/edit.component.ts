import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { APP_CONFIG, IAppConfig } from 'app/app.config';
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
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
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
        this.snackBar.open('添加属性值成功', null, this.appConfig.mdSnackBarConfig);
        this.propertyValues.push(p);
        inputRef.value = '';
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
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
        this.snackBar.open('删除属性值成功！', null, this.appConfig.mdSnackBarConfig);
      },
      (errMsg: string) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
    );
  }
}
