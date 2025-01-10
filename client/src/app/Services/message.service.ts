import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../Models/Interfaces/message';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { PaginatedResult } from '../Models/Classes/paginatedResult';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IUser } from '../Models/Interfaces/IUser';
import { Group } from '../Models/Interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl: string = environment.API_URL;
  hubUrl: string = environment.HUB_URL;
  private hubConnection!: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: IUser, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("ReceiveMessageThread", messages => {
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on("NewMessage", message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      })
    })

    this.hubConnection.on("UpdatedGroup", (group: Group) => {
      if(group.connections.some(x => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if(!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })
  }

  stopHubConnection() {
    if(this.hubConnection)
      this.hubConnection.stop();
  }

  getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<Message[]>> {

    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
    // return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content});
    return this.hubConnection.invoke("SendMessage", {recipientUsername: username, content})
      .catch(error => console.log(error));
  }

  deleteMessage(id: number): Observable<Object> {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
