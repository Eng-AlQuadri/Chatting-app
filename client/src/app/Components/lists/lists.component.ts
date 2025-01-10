import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../Services/members.service';
import { Member } from '../../Models/Interfaces/member';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { Pagination } from '../../Models/Interfaces/pagination';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-lists',
  imports: [RadioButtonModule, FormsModule, CommonModule, MemberCardComponent, PaginatorModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {

  members: Partial<Member[]> = [];
  predicate: string = 'liked';
  pageNumber: number = 1;
  pageSize: number = 5;
  pagination!: Pagination;

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page + 1;
    this.pageSize = event?.rows;
    this.loadLikes();
  }
}
