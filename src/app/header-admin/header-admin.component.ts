import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LogoServiceService } from '../Service/logo-service/logo-service.service';
import { AuthServiceService } from '../Service/auth-service/auth-service.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {
  logoUrl: SafeUrl = 'assets/logo.png';
  user: any = null;
  constructor(
    private logoService: LogoServiceService,
    private authService: AuthServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.logoService.getLogo().subscribe({
      next: (res) => {
        if (res?.media?.url) {
          this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(res.media.url);
        }
      },
      error: () => {
        console.error('Failed to load logo');
      }
    });

    this.user = this.authService.getUser();
    console.log('User from auth service:', this.user);
  }
}
