import { Component } from '@angular/core';
import { TimeServiceService } from '../../services/time-service.service';

@Component({
  selector: 'app-clock-settings',
  standalone: true,
  imports: [],
  templateUrl: './clock-settings.component.html',
  styleUrl: './clock-settings.component.scss'
})
export class ClockSettingsComponent {

  constructor(private timeService: TimeServiceService) {}

  incrementHours() {
    this.timeService.incrementHour();
  }

  decrementHours() {
    this.timeService.decrementHours();

  }

  incrementMinutes() {
    this.timeService.incrementMinutes(true);

  }

  decrementMinutes() {
    this.timeService.decrementMinutes();
  }
}
