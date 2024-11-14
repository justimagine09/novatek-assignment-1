import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalogClockComponent } from './components/analog-clock/analog-clock.component';
import { DigitalClockComponent } from './components/digital-clock/digital-clock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnalogClockComponent, DigitalClockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'novatek-assignment-1';
}
