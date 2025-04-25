import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { AuthServiceService } from '../Service/auth-service/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { APP_CONSTANTS } from '../shared/app-constants';
import { switchMap, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.scss',
})
export class LoginGoogleComponent implements OnInit {
  private authService = inject(SocialAuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  customAuthService: AuthServiceService = inject(AuthServiceService);
  user: SocialUser | null = null;

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        console.log('User logged in:', user);
        this.sendTokenToBackend(user.idToken);
      }
    });
  }

  sendTokenToBackend(idToken: string) {
    const url = `${APP_CONSTANTS.REST_API_SERVIER}/signin/google?idToken=${encodeURIComponent(idToken)}`;

    this.http
      .get<{ accessToken: string; refreshToken: string }>(url)
      .pipe(
        take(1),
        switchMap((response) => {
          if (response?.accessToken) {
            this.customAuthService.setToken(
              response.accessToken,
              response.refreshToken
            );
            this.router.navigate(['/dashboard']);
            return [true];
          }
          return [false];
        })
      )
      .subscribe(
        () => {},
        (error) => console.error('Error sending token:', error)
      );
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.user = null;
      this.customAuthService.logout();
    });
  }
}
