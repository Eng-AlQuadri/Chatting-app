import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
 } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public toastrService: ToastrService, public routerService: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(error => {
        if(error){
          switch(error.status) {
            case 400:
              if(error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if(error.error.errors[key])
                    modalStateErrors.push(...error.error.errors[key]);
                }
                throw modalStateErrors.flat();
              } else if (typeof(error.error) === 'object') {
                this.toastrService.error(error.statusText, error.status);
              } else {
                this.toastrService.error(error.error, error.status);
              }
              break;

            case 401:
              this.toastrService.error(error.error, error.status);
              break;

            case 404:
              this.routerService.navigateByUrl("/not-found");
              break;

            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}}
              this.routerService.navigateByUrl("/server-error", navigationExtras);
              break;

            default:
              this.toastrService.error("Something unexpected went wrong");
              console.log(error);
              break;
          }
        }
        return throwError(() => error);
      })
    )
  }
}
