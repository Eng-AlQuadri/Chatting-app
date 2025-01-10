import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-errors',
  imports: [FormsModule, CommonModule],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {

  baseUrl: string = "https://localhost:5001/api/";

  validationError: string [] = [];

  constructor(private http: HttpClient) {}

  get404Error(): void {
    this.http.get(this.baseUrl + "buggy/not-found").subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  get400Error(): void {
    this.http.get(this.baseUrl + "buggy/bad-request").subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  get500Error(): void {
    this.http.get(this.baseUrl + "buggy/server-error").subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  get401Error(): void {
    this.http.get(this.baseUrl + "buggy/auth").subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  get400ValidationError(): void {
    this.http.post(this.baseUrl + "account/register", {}).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
      this.validationError = error;
    })
  }
}
