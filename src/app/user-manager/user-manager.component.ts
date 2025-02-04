import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
  imports: [CommonModule],
})
export class UserManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') myModal!: ElementRef;
  private deleteModal: bootstrap.Modal | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only initialize modal instance in the browser environment
      import('bootstrap').then(bootstrap => {
        const modalElement = this.myModal.nativeElement; // Use ViewChild to get the modal element
        this.deleteModal = new bootstrap.Modal(modalElement); // Store the modal instance
      }).catch(error => {
        console.error('Error loading Bootstrap:', error);
      });
    }
  }

  ngAfterViewInit(): void {
    // Initialize the chart after view is loaded
    this.createChart();
  }

  // Delete user function (open modal)
  delete1() {
    if (this.deleteModal) {
      this.deleteModal.show(); // Show the modal using the cached modal instance
    } else {
      console.error('Modal instance is not available');
    }
  }

  // Close the modal
  closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide(); // Use the cached modal instance
    } else {
      console.error('Modal instance is not available');
    }
  }

  // Confirm deletion (you can implement actual delete logic here)
  confirmDelete() {
    console.log('Item deleted');
    this.closeModal(); // Close the modal after confirmation
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
