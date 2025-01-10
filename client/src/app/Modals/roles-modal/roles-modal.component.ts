import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService } from '../../Services/dialog.service';
import { IUser } from '../../Models/Interfaces/IUser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-modal',
  imports:
  [
    DialogModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent implements OnInit {

  @Output() userUpdated = new EventEmitter<any>();

  visible: boolean = false;
  user!: IUser;
  roles: any[] = [];

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    // Subscribe to visibility changes
    this.dialogService.dialogVisibility$.subscribe((isVisible) => {
      this.visible = isVisible;
    });

    // Subscribe to user changes
    this.dialogService.selectedUser$.subscribe((user) => {
      this.user = user;
      this.roles = this.getRolesArray(user);
    });
  }

  closeDialog() {
    this.dialogService.hideDialog();
  }

  showDialog() {
    this.visible = true;
  }

  updateRoles() {
    this.user.roles = this.roles.filter(role => role.checked).map(role => role.name);
    this.visible = false;
    this.userUpdated.emit(this.user);
  }

  private getRolesArray(user: Partial<IUser>) {
    const roles: any[] = [];
    const userRoles = user?.roles;
    const availableRoles: any[] = [
      {name: "Admin", value: "Admin"},
      {name: "Moderator", value: "Moderator"},
      {name: "Member", value: "Member"}
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles!) {
        if(role.name == userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }

      if(!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }
}
