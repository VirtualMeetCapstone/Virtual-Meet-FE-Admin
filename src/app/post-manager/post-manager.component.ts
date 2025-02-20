import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Post } from '../model/post';
import { PostServiceService } from '../Service/post-service/post-service.service';
import { UserService } from '../Service/user-service/user-service.service';
import { User } from '../model/user';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-post-manager',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './post-manager.component.html',
  styleUrl: './post-manager.component.scss'
})
export class PostManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') myModal!: ElementRef;
  private deleteModal: bootstrap.Modal | null = null;
 public posts: Post[] = [];
 public postData: Post[] = [];
 selectedPostId: string | null = null; 
 public userMap: Map<string, User> = new Map();
 private modalInstanceDelete: bootstrap.Modal | null = null;
 totalItems = 0; 
 itemsPerPage = 5; 
 currentPage = 1;
 public isLoading = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private postService: PostServiceService, private userService: UserService) {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    this.loadPosts();
    this.loadUsers();
    if (isPlatformBrowser(this.platformId)) {
      // Only initialize modal instance in the browser environment
      import('bootstrap').then(bootstrap => {
        setTimeout(() => { 
          const deleteModal = document.getElementById('deleteModal');
          if (deleteModal) {
            this.modalInstanceDelete = new bootstrap.Modal(deleteModal);
          } else {
            console.error('Modal element not found');
          }
        }, 100); 
      }).catch(error => {
        console.error('Error loading Bootstrap:', error);
      });
      
    }
  }
  private loadPosts(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const top = this.itemsPerPage;

    this.postService.getPosts(skip, top).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {
        this.postData = response.data;
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
    this.loadPosts();
  }
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return; // Kiểm tra giới hạn trang
    this.currentPage = page;
    this.loadPosts(); // Gọi API để lấy dữ liệu mới
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
  


  ngAfterViewInit(): void {
    // Initialize the chart after view is loaded
    this.createChart();
  }

  // Delete post function (open modal)
  delete1(postId: string): void {
    this.selectedPostId = postId;
    if (this.modalInstanceDelete) {
      this.modalInstanceDelete.show(); 
      console.log("modal ne" ,this.modalInstanceDelete)
    } else {
      console.error('Modal instance is not available');
    }
  }

  // Close the modal
   closeModal(): void {
     const modalElement = document.getElementById('deleteModal');
     if (modalElement) {
       const modalInstance = Modal.getInstance(modalElement);
       if (modalInstance) {
         modalInstance.hide();
         this.removeBackdrop(); 
       }
     }
   }
   private removeBackdrop(): void {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
  // Confirm deletion (you can implement actual delete logic here)
  confirmDelete(): void {
    if (!this.selectedPostId) {
        console.error('No room ID selected for deletion.');
        return;
    }

    console.log(`Deleting room with ID: ${this.selectedPostId}`);

    this.postService.deletePost(this.selectedPostId).subscribe(response => {
        console.log('Room deleted:', response);

        
        this.postData = this.postData.filter(post => post.id !== this.selectedPostId);
        this.selectedPostId = null; 
        this.closeModal();
    }, error => {
        console.error('Error deleting room:', error);
    });
}

  
  // Create the Line Chart
  createChart() {
    const ctx = document.getElementById('myLineChart') as HTMLCanvasElement;
    new Chart(ctx.getContext('2d')!, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'],
        datasets: [{
          label: 'Sales (in USD)',
          data: [100, 200, 150, 400, 350, 600, 400, 200, 150, 30],
          borderColor: 'rgb(255, 0, 85)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number Of User'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}

