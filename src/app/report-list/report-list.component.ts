import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',

})
export class ReportListComponent {
  public headerText: Object = [{ text: "Twitter", 'iconCss': 'e-twitter' },
    { text: "Facebook", 'iconCss': 'e-facebook' }, { text: "WhatsApp", 'iconCss': 'e-whatsapp' }];

}
