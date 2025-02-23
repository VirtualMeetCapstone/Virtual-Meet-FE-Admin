import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../Service/user-service/user-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  public userData: User[] = [];
  public users: User[] = [];
  totalItems = 0; 
 itemsPerPage = 5; 
 currentPage = 1;
 public isLoading = false;
 constructor(
    
     private userService: UserService,  
   ) {
    
   }
ngOnInit(): void {
    this.loadUsers(); 
    
  }

  ngAfterViewInit(): void {
    
  }

  // Method to load user data
  private loadUsers(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const top = this.itemsPerPage;

    this.userService.getUsersPaging(top, skip).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {
        this.userData = response.data;
        this.totalItems = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error =>{
      this.isLoading = false;
      console.error ("Error loading posts: ", error);
    });
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return; 
    this.currentPage = page;
    this.loadUsers(); 
  }
  get paginationRange(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
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
  onPageClick(page: number | string) {
    if (typeof page === 'number') {
      this.setPage(page);
    }
  }
}
