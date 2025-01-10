import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { MemberListComponent } from './Components/members/member-list/member-list.component';
import { MemberDetailComponent } from './Components/members/member-detail/member-detail.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { ListsComponent } from './Components/lists/lists.component';
import { authGuard } from './Guards/auth.guard';
import { TestErrorsComponent } from './Errors/test-errors/test-errors.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { ServerErrorComponent } from './Components/server-error/server-error.component';
import { MemberEditComponent } from './Components/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './Guards/prevent-unsaved-changes.guard';
import { MemberDetailedResolver } from './Resolvers/member-detailed.resolver';
import { AdminPanelComponent } from './Admin/admin-panel/admin-panel.component';
import { AdminGuard } from './Guards/admin.guard';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [authGuard],
    children: [
      {
        path: "members",
        component: MemberListComponent,
      },
      {
        path: "members/:username",
        component: MemberDetailComponent,
        resolve: {member: MemberDetailedResolver}
      },
      {
        path: "member/edit",
        component: MemberEditComponent,
        canDeactivate: [preventUnsavedChangesGuard]
      },
      {
        path: "lists",
        component: ListsComponent
      },
      {
        path: "messages",
        component: MessagesComponent
      },
      {
        path: "admin",
        component: AdminPanelComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  {
    path: "errors",
    component: TestErrorsComponent
  },
  {
    path: "not-found",
    component: NotFoundComponent
  },
  {
    path: "server-error",
    component: ServerErrorComponent
  },
  {
    path: "**",
    component: NotFoundComponent,
    pathMatch: "full"
  }
];
