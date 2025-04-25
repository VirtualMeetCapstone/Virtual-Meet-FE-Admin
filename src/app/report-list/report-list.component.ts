import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ReportServiceService} from '../Service/report-service/report-service.service';
import {forkJoin, map, Observable} from 'rxjs';
import {UserService} from '../Service/user-service/user-service.service';
import {User} from '../model/user';
import {Reports} from '../model/reports';
import {isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',

  imports: [
    NgForOf,
    NgIf
  ]
})
export class ReportListComponent implements OnInit {
  constructor(private reportService: ReportServiceService, private userService: UserService,
              @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public userReportedList: User[] = [];
  public reportList: Observable<any>[] = [];
  public reportsData: Reports[] = [];
  selectedUserId: string | null = null;
  private modalInstanceDelete: bootstrap.Modal | null = null;

  ngOnInit(): void {
    this.reportService.getReportList().subscribe((response: any[]) => {
      this.reportList = response;

      const userFetches = response
        .filter(report => report.reportType === 0)
        .map(report =>
          forkJoin({
            reporter: this.userService.getUserDetail(report.reporterId),
            targetReporter: this.userService.getUserDetail(report.targetId),
          }).pipe(
            map(result => ({
              reporter: result.reporter,
              targetReporter: result.targetReporter,
              reason: report.description,
              reporterId: report.reporterId,
              targetId: report.targetId
            }))
          )
        );

      forkJoin(userFetches).subscribe((reports: Reports[]) => {
        this.reportsData = reports.filter(report => !report.targetReporter.isDeleted);
        console.log(this.reportsData);
      });
    });

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


  reporterId: string = '';

  delete1(reporterId: string, userId: string): void {
    this.selectedUserId = userId;
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
    if (!this.selectedUserId) {
      console.error('No room ID selected for deletion.');
      return;
    }

    console.log(`Deleting room with ID: ${this.selectedUserId}`);

    this.userService.deleteUser(this.selectedUserId).subscribe(response => {
      this.reportService.deleteReport(this.reporterId, this.selectedUserId).subscribe({
        next: (res) => {
          console.log('Deleted successfully:', res);
          // Optionally reload list
          window.location.reload();

        },
        error: (err) => {
          console.error('Failed to delete:', err);
        }
      });
      this.selectedUserId = null;
      this.closeModal();
      window.location.reload();
    }, error => {
      console.error('Error deleting room:', error);
    });
  }

}
