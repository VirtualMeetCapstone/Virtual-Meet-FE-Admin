import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { HeaderAdminComponent } from "./header-admin/header-admin.component";
import { SidebarAdminComponent } from "./sidebar-admin/sidebar-admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {LogoServiceService} from './Service/logo-service/logo-service.service'; // Import provideHttpClient

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderAdminComponent, SidebarAdminComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Corrected from styleUrl to styleUrls

})
export class AppComponent implements OnInit {
  title = 'Virtual-Meet-FE-Admin-main';
  logoUrl = 'assets/logo.png';
  constructor(private router: Router, private logoService: LogoServiceService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const body = document.body;
        if (event.urlAfterRedirects === '/' || event.url === '/dashboard' || event.url.startsWith('/post-detail/')) {
          body.classList.add('dashboard-page');
          body.classList.remove('other-page');
        } else {
          body.classList.add('other-page');
          body.classList.remove('dashboard-page');
        }
      }
    });
  }

  ngOnInit(): void {
    this.logoService.getLogo().subscribe({
      next: (res) => {
        if (res?.media?.url) {
          this.logoUrl = res.media.url;
        }
      },
      error: () => {
        console.error('Failed to load logo');
      }
    });
  }
}
