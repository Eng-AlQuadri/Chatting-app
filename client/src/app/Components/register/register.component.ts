import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from "../../Forms/text-input/text-input.component";
import { DateInputComponent } from "../../Forms/date-input/date-input.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TextInputComponent, DateInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) {}

  model: any = {};
  registerForm!: FormGroup;
  maxDate!: Date;
  validationErrors: string[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent || !parent.controls) {
        return null; // If there's no parent or controls, no validation can occur
      }

      const controls = parent.controls as { [key: string]: AbstractControl };
      return control.value === controls[matchTo]?.value ? null : { isMatching: true };
    };
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }

  register(): void {
    this.accountService.register(this.registerForm.value).subscribe(() =>{
        this.router.navigateByUrl('/members');
      } , error => {
        this.validationErrors = error;
      }
    );
  }
}
