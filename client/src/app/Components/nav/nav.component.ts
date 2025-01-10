import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Services/account.service';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { IUser } from '../../Models/Interfaces/IUser';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../../Directives/has-role.directive';

@Component({
  selector: 'app-nav',
  imports: [
    FormsModule,
    CommonModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
    HasRoleDirective
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{

  public accountService = inject(AccountService);
  public router = inject(Router);
  public toaster = inject(ToastrService);

  model:any = {};
  loggedIn: boolean = false;


  ngOnInit(): void {

  }

  login(): void {
    this.accountService.login(this.model).subscribe(res => {
      this.router.navigateByUrl("/members");
    })
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

}
