import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { HasRoleDirective } from '../../Directives/has-role.directive';
import { UserManagementComponent } from "../user-management/user-management.component";
import { PhotoManagementComponent } from "../photo-management/photo-management.component";

@Component({
  selector: 'app-admin-panel',
  imports: [
    TabsModule,
    FormsModule,
    CommonModule,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent
],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
