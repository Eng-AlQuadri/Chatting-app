import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment.development';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../Models/Interfaces/IUser';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl: string = environment.HUB_URL;
  private hubConnection!: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: IUser) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on("UserIsOnline", username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username]);
      })
    })

    this.hubConnection.on("UserIsOffline", username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(x => x !== username)]);
      })
    })

    this.hubConnection.on("GetOnlineUsers", (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on("NewMessageReceived", ({username, knownAs}) => {
      this.toastr.info(knownAs + "has sent to you a message!")
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl("/members/" + username));
    })
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
