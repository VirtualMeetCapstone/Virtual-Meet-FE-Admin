import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from "./header-admin/header-admin.component";
import { SidebarAdminComponent } from "./sidebar-admin/sidebar-admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [HeaderAdminComponent, SidebarAdminComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Corrected from styleUrl to styleUrls

})
export class AppComponent {
  title = 'Virtual-Meet-FE-Admin-main';
}