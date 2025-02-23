import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../Service/user-service/user-service.service';
import { RoomServiceService } from '../Service/room-service/room-service.service';
import { PostServiceService } from '../Service/post-service/post-service.service';
import { Post } from '../model/post';
import { Room } from '../model/room';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  public userData: User[] = [];
  public users: User[] = [];
  public postData: Post[] = [];
  public roomData: Room[] = [];
 public userMap: Map<string, User> = new Map();

  totalUsers = 0; 
 usersPerPage = 5; 
 currentUserPage = 1;
 totalPosts = 0; 
 postsPerPage = 5; 
 currentPostPage = 1;
 totalRooms = 0; 
 roomsPerPage = 5; 
 currentRoomPage = 1;
 public isLoading = false;
 constructor(
    
     private userService: UserService,  
     private roomService: RoomServiceService,
     private postService: PostServiceService
   ) {
    
   }
ngOnInit(): void {
    this.loadUsers(); 
    this.loadPosts();
    this.loadRooms();
    this.loadUsersInfo();
  }

  // Method to load user data
  private loadUsers(): void {
    this.isLoading = true;
    const skip = (this.currentUserPage - 1) * this.usersPerPage;
    const top = this.usersPerPage;

    this.userService.getUsersPaging(top, skip).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {
        this.userData = response.data;
        this.totalUsers = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error =>{
      this.isLoading = false;
      console.error ("Error loading posts: ", error);
    });
  }
  private loadUsersInfo(): void {
    this.userService.getUsers().subscribe((response: any) => {
     
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
  
  private loadPosts(): void {
    this.isLoading = true;
    const skip = (this.currentPostPage - 1) * this.postsPerPage;
    const top = this.postsPerPage;

    this.postService.getPosts(skip, top).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {
        this.postData = response.data;
        this.totalPosts = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error =>{
      this.isLoading = false;
      console.error ("Error loading posts: ", error);
    });
  }

  private loadRooms(): void {
    this.isLoading = true;
    const skip = (this.currentRoomPage - 1) * this.roomsPerPage;
    const top = this.roomsPerPage;
    console.log(`Loading rooms - Skip: ${skip}, Top: ${top}`);
    this.roomService.getRoomsPaging(skip, top).subscribe((response: any) => {
      this.isLoading = false;
      console.log("API Response:", response); 
      if (Array.isArray(response.data)) {
        this.roomData = response.data;
        this.totalRooms = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error =>{
      this.isLoading = false;
      console.error ("Error loading rooms: ", error);
    });
  }
  get totalUserPages(): number {
    return Math.ceil(this.totalUsers / this.usersPerPage);
  }
  get totalPostPages(): number {
    return Math.ceil(this.totalPosts / this.postsPerPage);
  }
  get totalRoomPages(): number {
    return Math.ceil(this.totalRooms / this.roomsPerPage);
  }
  
  setUserPage(page: number) {
    if (page < 1 || page > this.totalUserPages) return; 
    this.currentUserPage = page;
    this.loadUsers(); 
  }
  setPostPage(page: number) {
    if (page < 1 || page > this.totalPostPages) return; 
    this.currentPostPage = page;
    this.loadPosts(); 
  }
  setRoomPage(page: number) {
    if (page < 1 || page > this.totalRoomPages) return; 
    this.currentRoomPage = page;
    this.loadRooms(); 
  }
  get paginationUserRange(): (number | string)[] {
    const totalPages = this.totalUserPages;
    const currentPage = this.currentUserPage;
    const range: (number | string)[] = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (currentPage > 4) {
        range.push('...');
      }
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 3) {
        range.push('...');
      }
      range.push(totalPages);
    }
    return range;
  }

  get paginationPostRange(): (number | string)[] {
    const totalPages = this.totalPostPages;
    const currentPage = this.currentPostPage;
    const range: (number | string)[] = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (currentPage > 4) {
        range.push('...');
      }
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 3) {
        range.push('...');
      }
      range.push(totalPages);
    }
    return range;
  }
  get paginationRoomRange(): (number | string)[] {
    const totalPages = this.totalRoomPages;
    const currentPage = this.currentRoomPage;
    const range: (number | string)[] = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (currentPage > 4) {
        range.push('...');
      }
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 3) {
        range.push('...');
      }
      range.push(totalPages);
    }
    return range;
  }
  onUserPageClick(page: number | string) {
    if (typeof page === 'number') {
      this.setUserPage(page);
    }
  }

  onPostPageClick(page: number | string) {
    if (typeof page === 'number') {
      this.setPostPage(page);
    }
  }
  onRoomPageClick(page: number | string) {
    if (typeof page === 'number') {
      this.setRoomPage(page);
    }
  }
}

