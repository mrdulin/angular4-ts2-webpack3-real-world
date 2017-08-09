import { Component, Input, OnInit, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxGroupComponent),
    multi: true
};

export interface IOptions {
  value: any,
  label: any,
  disabled?: boolean,
  checked?: boolean
}

@Component({
  selector: 'checkbox-group',
  templateUrl: './checkboxGroup.component.html',
  styleUrls: ['./checkboxGroup.component.css'],
  providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor{
  selectedValues: any[] = []
  fileList: any[]
  propagateChange: Function = (_: any) => {}
  @Input() onChange?: Function = () => {}
  @Input() options?: IOptions[] = []
  @Input() value?: any[] = []
  @Input() disabled?: boolean = false

  writeValue(value: any): void {
    
    if(value) {
      this.selectedValues = this.selectedValues.concat(value)
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any) {}

  ngOnInit(): void {
    const filterOptions = this.options && this.options.filter(item => item.checked) || []
    const selectedOptionValue = filterOptions.map(item => item.value)
    this.selectedValues = this.value && this.value.concat(selectedOptionValue) || selectedOptionValue
  }

  handleOnOptionChange($el: HTMLInputElement): void {
    const idx = this.selectedValues.indexOf($el.value)
    if (idx === -1 && $el.checked) {
      this.selectedValues.push($el.value)
    } else if(idx !== -1 && !$el.checked) {
      this.selectedValues.splice(idx, 1)
    }
    this.onChange(this.selectedValues)
    this.propagateChange(this.selectedValues)
  }
}
