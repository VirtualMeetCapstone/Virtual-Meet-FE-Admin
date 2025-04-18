import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LogoServiceService} from '../Service/logo-service/logo-service.service';

@Component({
  selector: 'app-header-admin',
  imports: [],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss'
})
export class HeaderAdminComponent implements OnInit{
  constructor(private logoService: LogoServiceService) {}
  logoUrl = 'assets/logo.png';
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
