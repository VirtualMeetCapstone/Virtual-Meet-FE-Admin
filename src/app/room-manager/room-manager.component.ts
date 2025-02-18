import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { RoomServiceService } from '../Service/room-service/room-service.service';
import { Room } from '../model/room';
import { Modal } from 'bootstrap';
declare var bootstrap: any;

@Component({
  selector: 'app-room-manager',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.scss']
})
export class RoomManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') myModal!: ElementRef;
  private modalInstanceDelete: bootstrap.Modal | null = null;
  public rooms: Room[] = [];
  public roomData: Room[] = [];
  selectedRoomId: string | null = null; 
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private roomService: RoomServiceService) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.loadRooms();

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

  ngAfterViewInit(): void {
    this.createChart();
  }

  // Load rooms
  private loadRooms(): void {
    this.roomService.getRooms().subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.rooms = data;
      } else {
        this.rooms = data?.data || [];
      }
      this.roomData = this.rooms;
    });
  }

  // Delete room function (open modal)
  delete1(roomId: string): void {
    this.selectedRoomId = roomId;
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
  // Confirm deletion
  confirmDelete(): void {
    if (!this.selectedRoomId) {
        console.error('No room ID selected for deletion.');
        return;
    }

    console.log(`Deleting room with ID: ${this.selectedRoomId}`);

    this.roomService.deleteRoom(this.selectedRoomId).subscribe(response => {
        console.log('Room deleted:', response);

        
        this.roomData = this.roomData.filter(room => room.id !== this.selectedRoomId);
        this.selectedRoomId = null; 
        this.closeModal();
    }, error => {
        console.error('Error deleting room:', error);
    });
}

  
  createChart(): void {
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
