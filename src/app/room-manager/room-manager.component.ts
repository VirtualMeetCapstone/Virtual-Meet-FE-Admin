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
  totalItems = 0; 
  itemsPerPage = 5; 
  currentPage = 1;
  public isLoading = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private roomService: RoomServiceService) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.loadRooms();

    if (isPlatformBrowser(this.platformId)) {
    
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
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const top = this.itemsPerPage;
    console.log(`Loading rooms - Skip: ${skip}, Top: ${top}`);
    this.roomService.getRoomsPaging(skip, top).subscribe((response: any) => {
      this.isLoading = false;
      console.log("API Response:", response); 
      if (Array.isArray(response.data)) {
        this.roomData = response.data;
        this.totalItems = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error =>{
      this.isLoading = false;
      console.error ("Error loading rooms: ", error);
    });
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  
  setPage(page: number) {
    if (isNaN(page) || page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRooms();
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
