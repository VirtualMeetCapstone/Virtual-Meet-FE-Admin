import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {ReportServiceService} from '../Service/report-service/report-service.service';
import {UserService} from '../Service/user-service/user-service.service';
import {User} from '../model/user';
import {forkJoin, map, Observable} from 'rxjs';
import {Reports} from '../model/reports';
import * as bootstrap from 'bootstrap';
import {RoomServiceService} from '../Service/room-service/room-service.service';
import {RoomReport} from '../model/room-report';

@Component({
  selector: 'app-room-reported-list',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './room-reported-list.component.html',
  styleUrl: './room-reported-list.component.scss'
})
export class RoomReportedListComponent implements OnInit {
  constructor(private reportService: ReportServiceService, private userService: UserService, private roomService: RoomServiceService,
              @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public reportList: Observable<any>[] = [];
  public reportsData: Reports[] = [];
  public roomReportData: RoomReport[] = [];
  reporterId: string = '';
  selectedRoomId: string | null = null;
  private modalInstanceDelete: bootstrap.Modal | null = null;

  ngOnInit(): void {
    this.reportService.getReportList().subscribe((response: any[]) => {
      this.reportList = response;
      console.log(response);
      const userRoomFetches = response
        .filter(report => report.reportType === 2) // chỉ lấy report phòng
        .map(report =>
          forkJoin({
            reporter: this.userService.getUserDetail(report.reporterId),
            reportedRoom: this.roomService.getRoomDetail(report.targetId),
          }).pipe(
            map(result => ({
              reporter: result.reporter,
              reportedRoom: result.reportedRoom,
              reason: report.description,
              reporterId: report.reporterId,
              targetId: report.targetId
            }))
          )
        );

      forkJoin(userRoomFetches).subscribe((roomReports: any[]) => {
        this.roomReportData = roomReports.filter(report => !report.reportedRoom?.isDeleted);
        console.log('ROOM REPORTED', this.roomReportData)
      });
    });

    // Bootstrap modal
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


  delete1(userId: string, reporterId: string): void {
    this.selectedRoomId = userId;
    this.reporterId = reporterId;
    console.log(userId);
    if (this.modalInstanceDelete) {
      this.modalInstanceDelete.show();
      console.log("modal ne", this.modalInstanceDelete)
    } else {
      console.error('Modal instance is not available');
    }
  }

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
    if (!this.selectedRoomId) {
      console.error('No room ID selected for deletion.');
      return;
    }

    console.log(`Deleting room with ID: ${this.selectedRoomId}`);

    this.roomService.deleteRoom(this.selectedRoomId).subscribe(response => {

      this.reportService.deleteReport(this.reporterId, this.selectedRoomId).subscribe({
        next: (res) => {
          console.log('Deleted successfully:', res);
          // Optionally reload list
          window.location.reload();
          this.selectedRoomId = null;

        },
        error: (err) => {
          console.error('Failed to delete:', err);
        }
      });
      this.closeModal();
      window.location.reload();
    }, error => {
      console.error('Error deleting room:', error);
    });
  }
}
