import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { IUser } from '../Models/Interfaces/IUser';
import { environment } from '../Environments/environment.development';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private presence: PresenceService) { }

  private currentUserSource: ReplaySubject<IUser | null> = new ReplaySubject<IUser | null>(1);
  currentUser$: Observable<IUser | null> = this.currentUserSource.asObservable();

  baseUrl: string = environment.API_URL;

  login(model: any): Observable<any> {
    return this.http.post<IUser>(this.baseUrl + "account/login", model).pipe(
      map((response: IUser) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
        return user;
      })
    )
  }

  register(model: any): Observable<any> {
    return this.http.post<IUser>("https://localhost:5001/api/account/register",model).pipe(
      map((user: IUser) => {
        if(user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: IUser) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
