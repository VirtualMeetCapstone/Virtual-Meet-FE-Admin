import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {FormsModule} from '@angular/forms';
import {PostReport} from '../model/postReport';
import {PostServiceService} from '../Service/post-service/post-service.service';
import {PercentPipe} from '@angular/common';

@Component({
  selector: 'app-post-report',
  imports: [
    FormsModule,
    PercentPipe
  ],
  templateUrl: './post-report.component.html',
  styleUrl: './post-report.component.scss'
})
export class PostReportComponent implements OnInit {
  today: string;
  beforeDate: string;
  afterDate: string;
  postReportData: PostReport | null = null;

  constructor(private postService: PostServiceService) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.afterDate = this.today;

    const before = new Date();
    before.setMonth(before.getMonth() - 1);
    this.beforeDate = before.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.fetchPostReport();
  }

  fetchPostReport(): void {
    if (this.isValidDateRange()) {
      // Mã hóa tham số ngày tháng
      const formattedBeforeDate = encodeURIComponent(this.convertToDateTime(this.beforeDate));
      const formattedAfterDate = encodeURIComponent(this.convertToDateTime(this.afterDate));

      // Gọi phương thức userReport với 2 tham số
      this.postService.postReport(formattedBeforeDate, formattedAfterDate).subscribe(data => {
        this.postReportData = data;
        console.log(this.postReportData);
      }, (error: any) => {
        console.error('Error occurred:', error);
      });
    } else {
      this.postReportData = null;
    }
  }

  postReportToExcel(): void {
    if (this.isValidDateRange()) {
      const formattedBeforeDate = encodeURIComponent(this.convertToDateTime(this.beforeDate));
      const formattedAfterDate = encodeURIComponent(this.convertToDateTime(this.afterDate));

      this.postService.postReportToExcel(formattedBeforeDate, formattedAfterDate)
        .subscribe((response: Blob) => {
          // Tạo file và trigger download
          const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Post_Report_${this.beforeDate}-${this.afterDate}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error: any) => {
          console.error('Error occurred:', error);
        });
    } else {
      this.postReportData = null;
    }
  }


  convertToDateTime(date: string): string {
    const dateObj = new Date(date); // Tạo đối tượng Date từ chuỗi
    const hours = String(dateObj.getHours()).padStart(2, '0');  // Lấy giờ
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');  // Lấy phút
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');  // Lấy giây

    // Trả về chuỗi định dạng 'yyyy-mm-dd hh:mm:ss'
    return `${date} ${hours}:${minutes}:${seconds}`;
  }

  isValidDateRange(): boolean {
    if (!this.beforeDate || !this.afterDate) return false;
    const from = new Date(this.beforeDate);
    const to = new Date(this.afterDate);
    const now = new Date(this.today);
    return from <= to && to <= now;
  }

  onDateChange(): void {
    this.fetchPostReport();
  }
}
