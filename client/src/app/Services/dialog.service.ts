import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogVisible = new BehaviorSubject<boolean>(false);
  private selectedUser = new BehaviorSubject<any>(null);

  public dialogVisibility$ = this.dialogVisible.asObservable();
  public selectedUser$ = this.selectedUser.asObservable();

  showDialog(user: any) {
    this.selectedUser.next(user);
    this.dialogVisible.next(true);
  }

  hideDialog() {
    this.dialogVisible.next(false);
    this.selectedUser.next(null);
  }
}
