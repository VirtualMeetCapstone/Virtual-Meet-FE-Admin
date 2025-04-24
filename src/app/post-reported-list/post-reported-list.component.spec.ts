import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReportedListComponent } from './post-reported-list.component';

describe('PostReportedListComponent', () => {
  let component: PostReportedListComponent;
  let fixture: ComponentFixture<PostReportedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostReportedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostReportedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
