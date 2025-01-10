import { Component, OnInit } from '@angular/core';
import { Message } from '../../Models/Interfaces/message';
import { Pagination } from '../../Models/Interfaces/pagination';
import { MessageService } from '../../Services/message.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-messages',
  imports: [RadioButtonModule, FormsModule, CommonModule, RouterLink, TitleCasePipe, PaginatorModule, TimeagoModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination!: Pagination;
  container: string = 'Unread';
  pageNumber: number = 1;
  pageSize: number = 5;
  loading: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(this.messages.findIndex(m => m.id === id), 1); // also we can use filter
    })
  }

  onPageChange(event: any): void {
    if(this.pageNumber === event.page) return; // double check that??!
    this.pageNumber = event.page + 1;
    this.pageSize = event?.rows;
    this.loadMessages();
  }
}
