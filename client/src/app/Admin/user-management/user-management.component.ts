import { Component, OnInit } from '@angular/core';
import { IUser } from '../../Models/Interfaces/IUser';
import { AdminService } from '../../Services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService } from '../../Services/dialog.service';
import { RolesModalComponent } from "../../Modals/roles-modal/roles-modal.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    RolesModalComponent
],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  visible: boolean = false;

  users!: Partial<IUser[]>;

  constructor(private adminService: AdminService, private dialogService: DialogService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getUsersWithRoles()
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  showDialog(user: Partial<IUser>) {
    this.dialogService.showDialog(user);
  }

  updateUser(updatedUser: Partial<IUser>) {
    this.adminService.updateUserRoles(updatedUser.username!, updatedUser.roles!).subscribe(() => {
      this.toastr.success("Updated Successfully")
    })
  }
}
