import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../Models/Interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<Partial<IUser[]>>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
}
