import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { map, Observable } from "rxjs";
import { AccountService } from "../Services/account.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user?.roles.includes("Admin") || user?.roles.includes("Moderator")) {
          return true;
        }

        this.toastr.error("You Cannot Enter This Area!");
        return false;
      })
    )
  }

}
