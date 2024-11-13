import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalogClockComponent } from './components/analog-clock/analog-clock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnalogClockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'novatek-assignment-1';
}
