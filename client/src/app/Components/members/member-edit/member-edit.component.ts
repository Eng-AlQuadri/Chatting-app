import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../Models/Interfaces/member';
import { IUser } from '../../../Models/Interfaces/IUser';
import { AccountService } from '../../../Services/account.service';
import { MembersService } from '../../../Services/members.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TabsModule } from 'primeng/tabs';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';

@Component({
  selector: 'app-member-edit',
  imports: [CommonModule, FormsModule, TabsModule, GalleriaModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm!: NgForm;

  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event: any) {
    if(this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  member!: Member;
  user!: IUser | null;

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
      this.loadMember();
  }

  loadMember(): void {
    this.memberService.getMember(this.user?.username!).subscribe(member => {
      this.member = member;
    })
  }

  updateMember(): void {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success("Updated Successfully");
      this.editForm.reset(this.member);
    })
  }

}
