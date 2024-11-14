import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalogClockComponent } from './components/analog-clock/analog-clock.component';
import { DigitalClockComponent } from './components/digital-clock/digital-clock.component';
import { ClockSettingsComponent } from './components/clock-settings/clock-settings.component';
import { TimeServiceService } from './services/time-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AnalogClockComponent, DigitalClockComponent, ClockSettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'novatek-assignment-1';

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: BeforeUnloadEvent) {
    const currentDate = new Date();

    if (
      this.timeService.getHours() !== currentDate.getHours() || this.timeService.getMinutes() !== currentDate.getMinutes()) {
      event.preventDefault();
      return 'true';
    };

    return null;
  }

  constructor(private timeService: TimeServiceService) {
  }
}
