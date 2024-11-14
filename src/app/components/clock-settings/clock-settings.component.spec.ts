import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockSettingsComponent } from './clock-settings.component';

describe('ClockSettingsComponent', () => {
  let component: ClockSettingsComponent;
  let fixture: ComponentFixture<ClockSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClockSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
