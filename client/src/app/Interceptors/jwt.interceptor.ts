import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AccountService } from '../Services/account.service';
import { IUser } from '../Models/Interfaces/IUser';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let currentUser!: IUser | null;

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);

    if(currentUser) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }

    return next.handle(req);
  }
}

