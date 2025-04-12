import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { UserService } from '../Service/user-service/user-service.service';
import { UserReport } from '../model/userReport';
import {PercentPipe} from '@angular/common';

@Component({
  selector: 'app-user-report',
  imports: [FormsModule, PercentPipe],
  templateUrl: './user-report.component.html',
  styleUrl: './user-report.component.scss'
})
export class UserReportComponent implements OnInit {
  today: string;
  beforeDate: string;
  afterDate: string;
  userReportData: UserReport | null = null;

  constructor(private userService: UserService) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.afterDate = this.today;

    const before = new Date();
    before.setMonth(before.getMonth() - 1);
    this.beforeDate = before.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.fetchUserReport();
  }

  fetchUserReport(): void {
    if (this.isValidDateRange()) {
      // Mã hóa tham số ngày tháng
      const formattedBeforeDate = encodeURIComponent(this.convertToDateTime(this.beforeDate));
      const formattedAfterDate = encodeURIComponent(this.convertToDateTime(this.afterDate));

      // Gọi phương thức userReport với 2 tham số
      this.userService.userReport(formattedBeforeDate, formattedAfterDate).subscribe(data => {
        this.userReportData = data;
        console.log(this.userReportData);
      }, error => {
        console.error('Error occurred:', error);
      });
    } else {
      this.userReportData = null;
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
    this.fetchUserReport();
  }

  exportToExcel(): void {
    const tables = ["user-report", "meeting-report", "post-report"];
    const wb = XLSX.utils.book_new();
    tables.forEach(id => {
      const table = document.getElementById(id);
      if (table) {
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, id);
      }
    });
    XLSX.writeFile(wb, "Admin_Report.xlsx");
  }
}
