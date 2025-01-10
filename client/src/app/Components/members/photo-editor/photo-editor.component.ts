import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../../Models/Interfaces/member';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { HttpClient } from '@angular/common/http';
import { MembersService } from '../../../Services/members.service';
import { AccountService } from '../../../Services/account.service';
import { take } from 'rxjs';
import { IUser } from '../../../Models/Interfaces/IUser';
import { ToastrService } from 'ngx-toastr';
import { Photo } from '../../../Models/Interfaces/photo';

@Component({
  selector: 'app-photo-editor',
  imports: [CommonModule, FormsModule, FileUpload],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {

  @Input() member!: Member;

  user!: IUser | null;
  currentMember!: Member;

  constructor(private http: HttpClient, private accountService: AccountService, private toastr: ToastrService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    this.memberService.getMember(this.user?.username!).subscribe(member => {
      this.currentMember = member;
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user!.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user!);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if(p.isMain) p.isMain = false;
        if(p.id === photo.id) p.isMain = true;
      })
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    })
  }

  onUpload(event: any, fileUpload: any): void {
    const formData = new FormData();

    this.uploadedFiles.push(event.files[0]);

    formData.append('file', event.files[0]);

    this.http.post('https://localhost:5001/api/users/add-photo', formData).subscribe(
      (response: any) => {

        fileUpload.clear();
        this.toastr.success("Uploaded Successfully");
        const photo: Photo = response;
        this.member.photos.push(photo);

        if(photo.isMain) {
          this.user!.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user!);
        }
      }
    );
  }
}
