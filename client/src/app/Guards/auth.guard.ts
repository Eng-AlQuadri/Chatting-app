import { CanActivateFn, mapToCanActivate, Router } from '@angular/router';
import { AccountService } from '../Services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const accountService: AccountService = inject(AccountService);
  const toastrService: ToastrService = inject(ToastrService);
  const router: Router = inject(Router);

  return accountService.currentUser$.pipe(
    map(user => {
      if(user) return true;
      else{
        toastrService.error("Access Denied");
        router.navigateByUrl("/");
        return false;
      }

    })
  )
}
