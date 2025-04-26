import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {DurationFormatPipe} from '../duration-format.pipe';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from '@angular/material/card';
import {MatSort} from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import {MatLine} from '@angular/material/core';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {MatPaginator} from '@angular/material/paginator';
import {RoomServiceService} from '../Service/room-service/room-service.service';
import {ActivatedRoute} from '@angular/router';
interface MetricItem {
  metric: string;
  value: any;
  type?: string;
}
@Component({
  selector: 'app-meeting-report-detail',
  imports: [
    NgSwitch,
    DurationFormatPipe,
    DatePipe,
    MatHeaderCellDef,
    NgSwitchCase,
    NgSwitchDefault,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatCardTitle,
    MatCardHeader,
    MatIcon,
    MatCard,
    MatTable,
    MatSort,
    MatColumnDef,
    MatLine,
    MatCardContent,
    MatList,
    MatListItem,
    MatDivider,
    MatCardModule,
    NgForOf
  ],
  templateUrl: './meeting-report-detail.component.html',
  styleUrl: './meeting-report-detail.component.scss'
})

export class MeetingReportDetailComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private meetingService: RoomServiceService,private route: ActivatedRoute) {}
  metricsDataSource = new MatTableDataSource<MetricItem>([]);
  displayedColumns: string[] = ['metric', 'value'];

  ngOnInit(): void {
    const meetingID: string = <string>this.route.snapshot.paramMap.get('id') ;

    this.meetingService.getMeetingReportDetail(meetingID).subscribe(data => {
      // Main data
      this.dataSource.data = [data];
      // Prepare metrics data
      this.metricsDataSource.data = [
        { metric: 'Longest Session', value: data.longestSessionTicks, type: 'duration' },
        { metric: 'Average Session', value: data.averageUserSessionTicks, type: 'duration' },
        { metric: 'First Join', value: data.firstJoinTime, type: 'date' },
        { metric: 'Last Join', value: data.peakTime, type: 'date' },
        { metric: 'Total Unique Users', value: data.totalUniqueUsers },
        { metric: 'Participation Rate', value: data.userParticipationRate }
      ];
      console.log('data ne',this.metricsDataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
