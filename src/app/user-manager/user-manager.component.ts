import {Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import * as bootstrap from 'bootstrap';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {UserService} from '../Service/user-service/user-service.service';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
})
export class UserManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') myModal!: ElementRef;
  private deleteModal: bootstrap.Modal | null = null;
  private modalInstanceDelete: bootstrap.Modal | null = null;
  selectedUserId: string | null = null;
  public users: User[] = [];
  public userData: User[] = [];
  totalItems = 0;
  itemsPerPage = 7;
  currentPage = 1;
  public isLoading = false;
  searchName: string = '';

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

  searchUser(): void {
    // alert(this.searchName)
    if (this.searchName.trim()) {
      this.userService.searchUser(this.searchName.trim()).subscribe(
        (res) => {
          this.userData = res;
          console.log(this.userData);
          this.totalItems = 0;
        },
        (err) => {
          console.error('Search failed:', err);
        }
      );
    } else {
      this.loadUsers();
    }
  }

  ngAfterViewInit(): void {
    // this.createChart();
  }

  // Method to load user data
  private loadUsers(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const top = this.itemsPerPage;

    this.userService.getUsersPaging(top, skip).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {

        this.userData = response.data.map((item: any) => ({
          ...item,
          formattedCreateTime: this.convertTicksToDateTime(item.createTime)
        }));
        this.totalItems = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error => {
      this.isLoading = false;
      console.error("Error loading posts: ", error);
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
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

  // Delete post function (open modal)
  delete1(userId: string): void {
    this.selectedUserId = userId;
    if (this.modalInstanceDelete) {
      this.modalInstanceDelete.show();
      console.log("modal ne", this.modalInstanceDelete)
    } else {
      console.error('Modal instance is not available');
    }
  }

  // Close the modal
  closeModal(): void {
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
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
    if (!this.selectedUserId) {
      console.error('No room ID selected for deletion.');
      return;
    }

    console.log(`Deleting room with ID: ${this.selectedUserId}`);

    this.userService.deleteUser(this.selectedUserId).subscribe(response => {
      console.log('Room deleted:', response);


      this.userData = this.userData.filter(user => user.id !== this.selectedUserId);
      this.selectedUserId = null;
      this.closeModal();
    }, error => {
      console.error('Error deleting room:', error);
    });
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
