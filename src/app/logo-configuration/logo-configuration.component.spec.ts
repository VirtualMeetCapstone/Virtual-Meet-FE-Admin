import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoConfigurationComponent } from './logo-configuration.component';

describe('LogoConfigurationComponent', () => {
  let component: LogoConfigurationComponent;
  let fixture: ComponentFixture<LogoConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
