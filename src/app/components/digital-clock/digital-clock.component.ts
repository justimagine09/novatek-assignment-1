import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { HtmlUtilities } from '../../utilities/html-utilities';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TimeServiceService } from '../../services/time-service.service';


const MAX_FONT_SIZE = 5;
const MIN_FONT_SIZE = 1;

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
        this.hours = hours > 12 ? hours - 12 : hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.suffix = hours > 12 ? 'PM' : 'AM';
      });
  }

  ngAfterViewInit() {
    HtmlUtilities.resizeObserver(this.frameElementRef!.nativeElement)
      .pipe(takeUntil(this.destroyed$$))
      .subscribe(() => {
        this.clockFontSize = this.frameElementRef!.nativeElement.clientWidth / 500 * 3.5;
        this.footHeight = this.frameElementRef!.nativeElement.clientWidth / 500 * 10;
        this.cdr.detectChanges();
      }); 
  }
}
