import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-report',
  imports: [
    FormsModule
  ],
  templateUrl: './user-report.component.html',
  styleUrl: './user-report.component.scss'
})
export class UserReportComponent implements OnInit{
  afterDate: string;
  beforeDate: string;
  constructor() {
    this.afterDate = new Date().toLocaleDateString(); // Format: MM/DD/YYYY (default)
    this.beforeDate = new Date().toLocaleDateString();
  }
  ngOnInit(): void {
    this.afterDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    let before = new Date();
    before.setMonth(before.getMonth() - 1);
    this.beforeDate = before.toISOString().split('T')[0];
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
