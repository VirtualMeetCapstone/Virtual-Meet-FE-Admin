import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportDetailComponent } from './meeting-report-detail.component';

describe('MeetingReportDetailComponent', () => {
  let component: MeetingReportDetailComponent;
  let fixture: ComponentFixture<MeetingReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingReportDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
