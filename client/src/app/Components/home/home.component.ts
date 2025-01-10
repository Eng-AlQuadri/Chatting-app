import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../Models/Interfaces/IUser';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor() {}

  registerMode: boolean = false;

  users: any;

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }

}
