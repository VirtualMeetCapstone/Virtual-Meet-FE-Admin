import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from "./header-admin/header-admin.component";
import { SidebarAdminComponent } from "./sidebar-admin/sidebar-admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [HeaderAdminComponent, SidebarAdminComponent, DashboardComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Virtual-Meet-FE-Admin-main';
}
