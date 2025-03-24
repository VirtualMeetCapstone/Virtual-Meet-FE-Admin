import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserManagerComponent} from './user-manager/user-manager.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {RoomDetailComponent} from './room-detail/room-detail.component';
import {RoomManagerComponent} from './room-manager/room-manager.component';
import {PostDetailComponent} from './post-detail/post-detail.component';
import {PostManagerComponent} from './post-manager/post-manager.component';
import {GeneralReportComponent} from './general-report/general-report.component';
import {EmailConfigurationComponent} from './email-configuration/email-configuration.component';
import {UserReportComponent} from './user-report/user-report.component';
import {MeetingReportComponent} from './meeting-report/meeting-report.component';
import {PostReportComponent} from './post-report/post-report.component';


export const routes: Routes = [
  {path: "", component: DashboardComponent},

  {path: "user-manager", component: UserManagerComponent},
  {path: "room-manager", component: RoomManagerComponent},
  {path: "post-manager", component: PostManagerComponent},
  {path: 'user-detail/:id', component: UserDetailComponent},
  {path: "room-detail/:id", component: RoomDetailComponent},
  {path: "post-detail/:id", component: PostDetailComponent},
  {path: "general-report", component: GeneralReportComponent},
  {path: "email-configuration", component: EmailConfigurationComponent},
  {path: "user-report", component: UserReportComponent},

  {path: "meeting-report", component: MeetingReportComponent},

  {path: "post-report", component: PostReportComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
