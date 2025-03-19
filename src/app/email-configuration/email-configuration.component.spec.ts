import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigurationComponent } from './email-configuration.component';

describe('EmailConfigurationComponent', () => {
  let component: EmailConfigurationComponent;
  let fixture: ComponentFixture<EmailConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
