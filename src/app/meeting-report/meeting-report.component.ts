import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {CommonModule, DatePipe} from '@angular/common';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {DurationFormatPipe} from '../duration-format.pipe';
import {RoomServiceService} from '../Service/room-service/room-service.service';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatAnchor, MatButtonModule} from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {min} from 'rxjs';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-meeting-report',
  standalone: true,
  imports: [
    FormsModule,
    MatPaginator,
    MatTable,
    MatFormField,
    DatePipe,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatInput,
    MatSortModule,
    DurationFormatPipe,
    RouterLink,
    MatIconModule,
    MatAnchor,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    ConfirmModalComponent,
  ],
  providers: [DatePipe],
  templateUrl: './meeting-report.component.html',
  styleUrl: './meeting-report.component.scss'
})
export class MeetingReportComponent implements OnInit {
  displayedColumns: string[] = ['roomTopic', 'ownerName', 'startTime', 'endTime', 'longestSessionTicks', 'averageUserSessionTicks', 'totalJoins', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private meetingService: RoomServiceService, private datePipe: DatePipe) {
    // Giả sử dữ liệu được lấy từ API hoặc truyền vào như biến input
    const jsonData = {
      "data": [],
      "totalCount": 1
    };
    this.dataSource.data = jsonData.data;

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.meetingService.getMeetingReport().subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  showSuccessModal = false;
  successMessage = '';
  filterByDate(): void {
    if (!this.startDate || !this.endDate) {

      this.successMessage = 'Please select both start date and end date!';
      this.showSuccessModal = true;
      return;
    }

    const formattedStart = this.datePipe.transform(this.startDate, 'yyyy-MM-dd HH:mm:ss');
    const formattedEnd = this.datePipe.transform(this.endDate, 'yyyy-MM-dd HH:mm:ss');

    if (formattedStart != null) {
      if (formattedEnd != null) {
        this.meetingService.getMeetingReportsByDateRange(formattedStart, formattedEnd)
          .subscribe(filteredData => {
            this.dataSource.data = filteredData;
            console.log("data sau khi filter", this.dataSource.data);
          });
      }
    }
  }

  resetDateFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.meetingService.getMeetingReport().subscribe({
      next: (response) => {

        this.dataSource.data = response.data || response;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  today = new Date();

  disableFutureDates = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (d || new Date()) <= today;
  };

  min(endDate: Date | null, today: Date) {
    if (endDate && endDate < today) {
      return endDate;
    }
    return today;
  }
}
