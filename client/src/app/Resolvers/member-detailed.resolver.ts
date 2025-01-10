import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { Member } from "../Models/Interfaces/member";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MembersService } from "../Services/members.service";

@Injectable({
  providedIn: 'root'
})

export class MemberDetailedResolver implements Resolve<Member> {

  constructor(private memberService: MembersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberService.getMember(route.paramMap.get('username')!);
  }

}
