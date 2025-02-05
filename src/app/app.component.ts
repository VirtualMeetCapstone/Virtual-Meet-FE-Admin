import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from "./header-admin/header-admin.component";
import { SidebarAdminComponent } from "./sidebar-admin/sidebar-admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail/user-detail.component';

@Component({
  selector: 'app-root',
  imports: [HeaderAdminComponent, SidebarAdminComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Virtual-Meet-FE-Admin-main';
}
