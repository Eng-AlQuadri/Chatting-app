import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../Models/Interfaces/member';
import { MembersService } from '../../../Services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabPanel, TabsModule } from 'primeng/tabs';
import { GalleriaModule } from 'primeng/galleria';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../../Models/Interfaces/message';
import { MessageService } from '../../../Services/message.service';
import { PresenceService } from '../../../Services/presence.service';
import { IUser } from '../../../Models/Interfaces/IUser';
import { AccountService } from '../../../Services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  imports:
  [
    CommonModule,
    FormsModule,
    TabsModule,
    GalleriaModule,
    DatePipe,
    MemberMessagesComponent,
    AsyncPipe
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  member!: Member;
  imageUrls: any[] = [];
  activeTabIndex: number = 0;
  messages: Message[] = [];
  user!: IUser;

  constructor(public presence: PresenceService, private route: ActivatedRoute,
    private messageService: MessageService, private accountService: AccountService,
    private router: Router) {

      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user!;
      })

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

  ngOnInit(): void {
    // this.loadMember();

    this.route.queryParams.subscribe(params => {
      params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
    })

    this.route.data.subscribe(data => {
      this.member = data['member'];
    })

    this.getImages();

    this.messageService.createHubConnection(this.user,this.member.userName);

  }

  getImages(): void {
    this.imageUrls = this.member.photos.map(photo => ({
      itemImageSrc: photo.url, // Full-size image
      thumbnailImageSrc: photo.url, // Thumbnail (use a smaller image if available)
      alt: 'Photo',
      title: this.member.knownAs // Add a meaningful title if needed
    }));
  }

  // loadMember(): void {
  //   this.memberService.getMember(this.route.snapshot.paramMap.get("username") ?? "default").subscribe(member => {
  //     this.member = member;
  //   })
  // }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages => {
      this.messages = messages;
      this.messageService.createHubConnection(this.user,this.member.userName);
    })
  }

  onTabActivated(index: number) {
    this.activeTabIndex = index;
    if(this.activeTabIndex === 3 && this.messages.length === 0) {
      this.loadMessages();
      //this.messageService.createHubConnection(this.user,this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }

  }

  selectTab(index: number): void {
    this.activeTabIndex = index;
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
