import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-general-report',
  imports: [],
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.scss'
})
export class GeneralReportComponent {

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
