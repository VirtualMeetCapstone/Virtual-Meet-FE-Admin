import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { PostServiceService } from '../Service/post-service/post-service.service';
import { Post } from '../model/post';
import { UserService } from '../Service/user-service/user-service.service';
import { User } from '../model/user';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {

public post : Post |null = null;
public userMap: Map<string, User> = new Map();

constructor(
  private route: ActivatedRoute,
  private postService: PostServiceService ,
  private userService: UserService
) {}

ngOnInit(): void {
  this.loadUsers();
  const postId = this.route.snapshot.paramMap.get('id');

  if (postId) {
    this.postService.getPostDetail( postId).subscribe(
      (data: Post) => {
        this.post = data;
        this.post.formattedCreateTime = this.convertTicksToDateTime(data.createTime);
        console.log("post detail",this.post)
      },
      error => {
        console.error('Error fetching post detail:', error);
      }
    );
  }
}
  private loadUsers(): void {
    this.userService.getUsers().subscribe((response: any) => {
      console.log("Response from UserService:", response); // Log the response to check its structure

      // Handle the response and ensure it's an array of users
      if (Array.isArray(response)) {
        response.forEach((user: User) => {
          this.userMap.set(user.id, user);
        });
      } else if (response && Array.isArray(response.data)) {
        response.data.forEach((user: User) => {
          this.userMap.set(user.id, user);
        });
      } else {
        console.error("Unexpected response format:", response);
      }
    });
  }
  getUserName(userId: string | undefined): string {
    return userId ? this.userMap.get(userId)?.name || 'Deleted User' : 'User not found';
  }
  getUserBio(userId: string | undefined): string {
    return userId ? this.userMap.get(userId)?.bio || 'Deleted User' : 'User not found';
  }
  getUserImage(userId: string | undefined): string {
    const user = userId ? this.userMap.get(userId) : undefined;
    return user?.picture?.url || '';
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
