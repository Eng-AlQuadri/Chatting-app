import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../../Models/Interfaces/message';
import { MessageService } from '../../../Services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-messages',
  imports:
  [
    FormsModule,
    CommonModule,
    TimeagoModule,
    AsyncPipe
  ],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {

  @ViewChild('messageForm') messageForm!: NgForm;
  @Input() username: string = '';
  messages: Message[] = [];
  messageContent: string = '';

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {
      this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessageThread(this.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    })
  }

}
