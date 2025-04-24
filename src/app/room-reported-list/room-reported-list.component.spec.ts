import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomReportedListComponent } from './room-reported-list.component';

describe('RoomReportedListComponent', () => {
  let component: RoomReportedListComponent;
  let fixture: ComponentFixture<RoomReportedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomReportedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomReportedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
