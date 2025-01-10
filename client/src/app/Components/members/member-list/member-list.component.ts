import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../../Models/Interfaces/member';
import { MembersService } from '../../../Services/members.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from "../member-card/member-card.component";
import { Pagination } from '../../../Models/Interfaces/pagination';
import { PaginatorModule } from 'primeng/paginator';
import { UserParams } from '../../../Models/Classes/userParams';
import { IUser } from '../../../Models/Interfaces/IUser';
import { AccountService } from '../../../Services/account.service';
import { take } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-member-list',
  imports: [FormsModule, CommonModule, MemberCardComponent, PaginatorModule, RadioButtonModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {

  members: Member[] = [];
  pagination!: Pagination;
  userParams!: UserParams;
  user!: IUser;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters(): void {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  onPageChange(event: any): void {
    this.userParams.pageNumber = event.page + 1;
    this.userParams.pageSize = event?.rows;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
