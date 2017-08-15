import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar, MdDialog } from '@angular/material';

import { APP_CONFIG, IAppConfig } from 'app/app.config';
import { PropertySerivce } from 'root/src/services';
import { UtilService } from 'common/services';
import { ITableHeader } from 'common/interfaces';

import { Pluck } from 'common/pipes';
import { SubPropertyDataSource } from './sub-property-data-source';

@Component({
  selector: 'attr-edit',
  templateUrl: './edit.component.html'
})
export class AttrEditComponent implements OnInit {
  property: any;
  propertyValues: any[];

  queryTypes: any[] = [
    { name: '单选', key: '1' },
    { name: '多选', key: '2' }
  ];
  sub: any;

  selectedQueryType: any;
  subPropertyName: string;

  tableHeaders: ITableHeader[] = [
    { key: 'name', name: '子属性项名称', cell: (row: any) => row.propertyName },
    { key: 'id', name: '子属性项ID', cell: (row: any) => row.propertyId },
    { key: 'type', name: '选择类型', cell: (row: any) => PropertySerivce.choiceMap.get(row.choice) },
    { key: 'value', name: '属性值', cell: (row: any) => this.pluckPipe.transform(row.propertyValues, 'propertyValue') }
  ];
  displayedColumns: string[] = [];
  dataSource: SubPropertyDataSource;

  pageIndex: number;
  pageSize: number;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private propertyService: PropertySerivce,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private snackBar: MdSnackBar,
    private pluckPipe: Pluck,
    private dialog: MdDialog
  ) {
  }

  ngOnInit() {
    this.property = this.propertyService.getCurrentEditProperty();
    if (!this.property) {
      this.back();
      return;
    }
    this.propertyValues = this.utilService.copy(this.property.propertyValues) || [];
    this.displayedColumns = this.tableHeaders.map((header: ITableHeader): string => header.key);
    this.dataSource = new SubPropertyDataSource(this.propertyService);
    this.sub = this.dataSource.getSubPropertiesById(this.property.propertyId).subscribe(
      () => null,
      this.getSubPropertiesByIdFailed
    );
  }

  getSubPropertiesByIdFailed(errMsg: string) {
    this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
  }

  back() {
    const { queryParams } = this.activatedRoute.snapshot;
    this.router.navigate(['/tag-manager/attribute'], { queryParams });
  }

  /**
   * 添加子属性项
   *
   * @memberof AttrEditComponent
   */
  addSubProperty() {
    const { propertyId } = this.property;
    const subProperties: any[] = [];
    subProperties.push({
      propertyName: this.subPropertyName,
      choice: this.selectedQueryType.key
    });
    const postBody = { propertyId, subProperties };

    this.dataSource.addSubProperty(postBody).subscribe(
      () => {
        this.snackBar.open('新增子属性项成功', null, this.appConfig.mdSnackBarConfig);
        this.dataSource.getSubPropertiesById(propertyId).subscribe(() => null, this.getSubPropertiesByIdFailed);
      },
      (errMsg) => this.snackBar.open(errMsg, null, this.appConfig.mdSnackBarConfig)
    )
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
