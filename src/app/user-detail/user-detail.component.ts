import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../Service/user-service/user-service.service';

@Component({
  selector: 'app-user-detail',
    imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
public user : User |null = null;

constructor(
  private route: ActivatedRoute,
  private userService: UserService
) {}

ngOnInit(): void {
  const userId = this.route.snapshot.paramMap.get('id');

  if (userId) {
    this.userService.getUserDetail( userId).subscribe(
      (data: User) => {
        this.user = data;
        this.user.formattedCreateTime = this.convertTicksToDateTime(data.createTime);
      },
      error => {
        console.error('Error fetching user detail:', error);
      }
    );
  }
}
  convertTicksToDateTime(ticks: number): string {
    const epochTicks = 621355968000000000;
    const tickMs = 0.0001;
    const jsTime = (ticks - epochTicks) * tickMs;
    const date = new Date(jsTime);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
