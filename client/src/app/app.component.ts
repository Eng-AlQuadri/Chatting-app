import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./Components/nav/nav.component";
import { IUser } from './Models/Interfaces/IUser';
import { AccountService } from './Services/account.service';
import { HomeComponent } from "./Components/home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { PresenceService } from './Services/presence.service';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  users!: IUser;
  ngOnInit(): void {
      this.setCurrentUser();
  }
  accountService = inject(AccountService);

  constructor(private presence: PresenceService) {}

  setCurrentUser() {
    const jsonUser = localStorage.getItem("user");
    if(jsonUser)
    {
      const user: IUser = JSON.parse(jsonUser);
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
  }

}
