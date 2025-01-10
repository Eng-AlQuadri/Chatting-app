import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../../Models/Interfaces/member';
import { RouterLink } from '@angular/router';
import { MembersService } from '../../../Services/members.service';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from '../../../Services/presence.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-card',
  imports:
  [
    RouterLink,
    FormsModule,
    CommonModule,
    AsyncPipe
  ],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent implements OnInit {

  @Input() member!: Member;

  constructor(private memberService: MembersService, private toastr: ToastrService, public presence: PresenceService) {}

  ngOnInit(): void {

  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe(() => {
      this.toastr.success(`You Have Liked ${member.knownAs}`);
    })
  }

}
