import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {FormsModule} from '@angular/forms';
import {RevenueServiceService} from '../Service/revenue-service/revenue-service.service';
import {RevenueReport} from '../model/revenue-report';

@Component({
  selector: 'app-revenue-report',
  imports: [
    FormsModule
  ],
  templateUrl: './revenue-report.component.html',
  styleUrl: './revenue-report.component.scss'
})
export class RevenueReportComponent implements OnInit {
  afterDate: string;
  beforeDate: string;
  revenueReport: RevenueReport | null = null;
  today: string ='';

  constructor(private revenueService: RevenueServiceService) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.afterDate = this.today;

    const before = new Date();
    before.setMonth(before.getMonth() - 1);
    this.beforeDate = before.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const now = new Date();

    this.today = now.toISOString().split('T')[0];

    this.afterDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    let before = new Date();
    before.setMonth(before.getMonth() - 1);
    this.beforeDate = before.toISOString().split('T')[0];
    this.fetchRevenueReport();
  }
  fetchRevenueReport(): void {
    if (this.isValidDateRange()) {
      const formattedBeforeDate = encodeURIComponent(this.convertToDateTime(this.beforeDate));
      const formattedAfterDate = encodeURIComponent(this.convertToDateTime(this.afterDate));

      this.revenueService.getRevenueReport(formattedBeforeDate, formattedAfterDate).subscribe(response => {
        // response.data là mảng -> lấy phần tử đầu tiên response.data[0]
        if (response.data && response.data.length > 0) {
          this.revenueReport = response.data[0];
          console.log(this.revenueReport?.totalPaidOrders);
        } else {
          this.revenueReport = null;
        }
        console.log(this.revenueReport);
      }, error => {
        console.error('Error occurred:', error);
      });
    } else {
      this.revenueReport = null;
    }
  }

  convertToDateTime(date: string): string {
    const dateObj = new Date(date); // Tạo đối tượng Date từ chuỗi
    const hours = String(dateObj.getHours()).padStart(2, '0');  // Lấy giờ
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');  // Lấy phút
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');  // Lấy giây

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
    this.fetchRevenueReport();
  }

  exportToExcel() {
    let tables = ["user-report", "meeting-report", "post-report"];
    let wb = XLSX.utils.book_new();
    tables.forEach(id => {
      let ws = XLSX.utils.table_to_sheet(document.getElementById(id));
      XLSX.utils.book_append_sheet(wb, ws, id);
    });
    XLSX.writeFile(wb, "Admin_Report.xlsx");
  }

}
