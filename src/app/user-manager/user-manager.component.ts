import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../Service/user-service/user-service.service'; 
import { Observable } from 'rxjs';
import { User } from '../model/user';
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class UserManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') myModal!: ElementRef;
  private deleteModal: bootstrap.Modal | null = null;
 
  public users: User[] = [];
  public userData : User[] = [];
  totalItems = 0; 
 itemsPerPage = 15; 
 currentPage = 1;
 public isLoading = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,  
  ) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.loadUsers(); 
    
    console.log("user data", this.userData);
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap').then(bootstrap => {
        const modalElement = this.myModal.nativeElement;
        this.deleteModal = new bootstrap.Modal(modalElement);
      }).catch(error => {
        console.error('Error loading Bootstrap:', error);
      });
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
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
    if (page < 1 || page > this.totalPages) return; // Kiểm tra giới hạn trang
    this.currentPage = page;
    this.loadUsers(); // Gọi API để lấy dữ liệu mới
  }

  delete1() {
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      console.error('Modal instance is not available');
    }
  }

  closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
    } else {
      console.error('Modal instance is not available');
    }
  }

  confirmDelete() {
    console.log('Item deleted');
    this.closeModal();
  }
  
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