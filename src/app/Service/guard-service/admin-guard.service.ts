import { Injectable } from '@angular/core';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    if (user && user.role === 'Admin') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
