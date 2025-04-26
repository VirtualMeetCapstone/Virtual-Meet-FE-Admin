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
import {RevenueReportComponent} from './revenue-report/revenue-report.component';
import {LogoConfigurationComponent} from './logo-configuration/logo-configuration.component';
import {ReportListComponent} from './report-list/report-list.component';
import {RoomReportedListComponent} from './room-reported-list/room-reported-list.component';
import {LoginGoogleComponent} from './login-google/login-google.component';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { AdminGuardService } from './Service/guard-service/admin-guard.service';
import {MeetingReportDetailComponent} from './meeting-report-detail/meeting-report-detail.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginGoogleComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuardService] },

  { path: 'user-manager', component: UserManagerComponent, canActivate: [AdminGuardService] },
  { path: 'room-manager', component: RoomManagerComponent, canActivate: [AdminGuardService] },
  { path: 'post-manager', component: PostManagerComponent, canActivate: [AdminGuardService] },
  { path: 'user-detail/:id', component: UserDetailComponent, canActivate: [AdminGuardService] },
  { path: 'room-detail/:id', component: RoomDetailComponent, canActivate: [AdminGuardService] },
  { path: 'post-detail/:id', component: PostDetailComponent, canActivate: [AdminGuardService] },
  { path: 'general-report', component: GeneralReportComponent, canActivate: [AdminGuardService] },
  { path: 'email-configuration', component: EmailConfigurationComponent, canActivate: [AdminGuardService] },
  { path: 'user-report', component: UserReportComponent, canActivate: [AdminGuardService] },
  { path: 'meeting-report', component: MeetingReportComponent, canActivate: [AdminGuardService] },
  { path: 'post-report', component: PostReportComponent, canActivate: [AdminGuardService] },
  { path: 'revenue-report', component: RevenueReportComponent, canActivate: [AdminGuardService] },
  { path: 'logo-configuration', component: LogoConfigurationComponent, canActivate: [AdminGuardService] },
  { path: 'report-list', component: ReportListComponent, canActivate: [AdminGuardService] },
  { path: 'room-reported-list', component: RoomReportedListComponent, canActivate: [AdminGuardService] },
  { path: 'meeting-report/:id', component: MeetingReportDetailComponent, canActivate: [AdminGuardService] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes),
    SocialLoginModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
