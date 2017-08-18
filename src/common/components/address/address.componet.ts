import { Component, Input, OnInit, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MdSnackBar } from '@angular/material'
import { AddressService } from 'common/services'

interface IAddressObject{
  code: number,
  name: string
}

export interface IAddress{
  country?: IAddressObject,
  province?: IAddressObject,
  city?: IAddressObject,
  district?: IAddressObject
}

export interface ISetAddress{
  countryCode?: number,
  provinceCode?: number,
  cityCode?: number,
  districtCode?: number
}

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AddressComponent),
    multi: true
}

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class AddressComponent implements OnInit, ControlValueAccessor{
  selectedValue: IAddress
  setAddressValue: ISetAddress
  propagateChange: Function = (_: any) => {}
  @Input() countryCode?: number
  @Input() provinceCode?: number
  @Input() cityCode?: number
  @Input() districtCode?: number
  @Input() showCountry?: boolean = false
  @Input() showDistrict?: boolean = false

  constructor(
    private addressService: AddressService, 
    private snackbar: MdSnackBar
  ) {}

  writeValue(value: any): void {
    if(value) {
      this.setAddressValue = value
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any) {}

  ngOnInit(): void {

  }

}
