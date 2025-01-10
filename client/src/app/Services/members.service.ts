import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment.development';
import { map, Observable, of, take } from 'rxjs';
import { Member } from '../Models/Interfaces/member';
import { PaginatedResult } from '../Models/Classes/paginatedResult';
import { UserParams } from '../Models/Classes/userParams';
import { AccountService } from './account.service';
import { IUser } from '../Models/Interfaces/IUser';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members: Member[] = []; // store state
  memberCache = new Map();  // : Map<string,Member[]>
  user!: IUser;
  userParams!: UserParams;

  baseUrl = environment.API_URL;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user!;
      this.userParams = new UserParams(user!);
    });
  }

  getUserParams(): UserParams {
    return this.userParams;
  }

  setUserParams(params: UserParams): void {
    this.userParams = params;
  }

  resetUserParams(): UserParams {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  addLike(username: string): Observable<Object> {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {

    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response)
      return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }))
  }

  getMember(username: string): Observable<Member> {
    // const member = this.members.find(x => x.userName === username);
    // if(member !== undefined)
    //   return of(member);

    const member = [...this.memberCache.values()]
      .reduce((arr,elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName == username);

    if(member)
      return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member): Observable<void> {
    return this.http.put<Member>(this.baseUrl + "users", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(environment.API_URL + "users/set-main-photo/" + photoId, {}); // {} because it is put request
  }

  deletePhoto(photoId: number) {
    return this.http.delete(environment.API_URL + 'users/delete-photo/' + photoId);
  }


}
