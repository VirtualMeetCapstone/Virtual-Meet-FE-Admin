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
  private loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      console.log("user", data);
      
     
      if (Array.isArray(data)) {
        this.users = data;
      } else {
        this.users = data?.data || []; 
      }
  
      this.userData = this.users;
    });
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