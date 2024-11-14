import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { HtmlUtilities } from '../../utilities/html-utilities';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TimeServiceService } from '../../services/time-service.service';


const CLOCK_FONT_SIZE = 7;
const FOOT_HEIGHT = 10;
const THRESHOLD = 500;

@Component({
  selector: 'app-digital-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digital-clock.component.html',
  styleUrl: './digital-clock.component.scss'
})
export class DigitalClockComponent implements AfterViewInit {
  @ViewChild('frame') frameElementRef?: ElementRef<HTMLDivElement>;
  hours = 0;
  minutes = 0;
  seconds = 0;
  suffix: string | null = null;

  clockFontSize = 0;
  footHeight = 0;

  private destroyed$$ = new Subject();

  constructor(private cdr: ChangeDetectorRef, private timeService: TimeServiceService) {
    combineLatest([this.timeService.hours$, this.timeService.minutes$, this.timeService.seconds$])
      .pipe(takeUntil(this.destroyed$$))
      .subscribe(([hours, minutes, seconds]) => {
        if (hours < 24) {
          this.hours = hours > 12 ? hours - 12 : hours;
        } else {
          this.hours = 0;
        }
        
        this.minutes = minutes;
        this.seconds = seconds;
        this.suffix = hours >= 12 && hours < 24 ? 'PM' : 'AM';
      });
  }

  ngAfterViewInit() {
    HtmlUtilities.resizeObserver(this.frameElementRef!.nativeElement)
      .pipe(takeUntil(this.destroyed$$))
      .subscribe(() => {
        this.clockFontSize = this.frameElementRef!.nativeElement.clientWidth / THRESHOLD * CLOCK_FONT_SIZE;
        this.footHeight = this.frameElementRef!.nativeElement.clientWidth / THRESHOLD * FOOT_HEIGHT;
        this.cdr.detectChanges();
      }); 
  }
}
