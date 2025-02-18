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
      },
      error => {
        console.error('Error fetching user detail:', error);
      }
    );
  }
}
}
