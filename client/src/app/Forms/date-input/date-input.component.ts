import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-input',
  imports: [DatePicker, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css'
})
export class DateInputComponent implements ControlValueAccessor {

  @Input() label: string = '';
  @Input() maxDate!: Date;

  selectedDate!: Date;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {

  }

  registerOnTouched(fn: any): void {

  }

}
