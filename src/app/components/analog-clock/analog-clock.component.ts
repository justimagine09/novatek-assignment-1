import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, delay, filter, interval, map, of, Subject, take, takeUntil } from 'rxjs';
import { TimeServiceService } from '../../services/time-service.service';
import { HtmlUtilities } from '../../utilities/html-utilities';

interface ClockNumber {
  value: number;
  posX: number;
  posY: number;
}

enum NumberFontSizes {
  large = 2.3,
  medium = 2,
  small = 1.5,
  extraSmall = 1
}

@Component({
  selector: 'app-analog-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analog-clock.component.html',
  styleUrl: './analog-clock.component.scss'
})
export class AnalogClockComponent implements AfterViewInit, OnDestroy {
  @ViewChild('frame') frameElementRef?: ElementRef<HTMLDivElement>;
  @ViewChild('clock') clockElementRef?: ElementRef<HTMLDivElement>;
  hours = 0;
  minutes = 4;
  seconds = 0;
  ready = false;
  numberFontSize: NumberFontSizes = NumberFontSizes.large;
  numbers: ClockNumber[] = [];

  private maxHours = 12;
  private maxMinutesAndSeconds = 60;
  private destroyed$$ = new Subject();

  constructor(private timeService: TimeServiceService) {
    for (let i = 1; i <= 12; i++) {
      this.numbers.push({value: i, posX: 0, posY: 0});
    }

    combineLatest([this.timeService.hours$, this.timeService.minutes$, this.timeService.seconds$])
      .pipe(takeUntil(this.destroyed$$))
      .subscribe(([hours, minutes, seconds]) => {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$$.next(true);
    this.destroyed$$.complete();
  }

  ngAfterViewInit(): void {
    HtmlUtilities.resizeObserver(this.frameElementRef!.nativeElement)
      .subscribe(() => {
        this.setNumbersPositionAndFontSize();
      }); 

    /** Make Component Ready and number positions once the frame rendered on the scree */
    interval(10)
      .pipe(
        takeUntil(this.destroyed$$),
        filter(() => this.frameElementRef!.nativeElement.clientWidth > 0),
        take(1)
      )
      .subscribe(() => {
        this.ready = true;
        this.setNumbersPositionAndFontSize();
      })
  }

  get hourDegree() {
    let tempTime = this.hours;

    if (this.hours > this.maxHours) {
      tempTime -= this.maxHours;
    }
    
    const maxSeconds = this.convertToSeconds(this.maxHours - 1, this.maxMinutesAndSeconds, this.maxMinutesAndSeconds);
    const currentTimeSeconds = this.convertToSeconds(tempTime, this.minutes, this.seconds);
  
    const degree = (currentTimeSeconds / maxSeconds) * 360;
    return `${degree}deg`;
  }

  get minuteDegree() {
    const maxSeconds = this.convertToSeconds(0, this.maxMinutesAndSeconds, this.maxMinutesAndSeconds);
    const currentTimeSeconds = this.convertToSeconds(0, this.minutes, this.seconds);
    const degree = (currentTimeSeconds / maxSeconds) * 360;

    return `${degree}deg`;
  }

  get secondDegree() {
    const degree = (this.seconds / this.maxMinutesAndSeconds) * 360;

    return `${degree}deg`;
  }

  setNumbersPositionAndFontSize() {
    const numbersLength = this.numbers.length;
    const radius = 360 / numbersLength;
    const clockWidth = this.clockElementRef?.nativeElement?.clientWidth ?? 0;
    const percentage = 0.8;
    // make half of 80 percent of the circle diameter as distace of the numbers
    const distance = (clockWidth * percentage) / 2;

    this.updateNumberFontSizeAndView(clockWidth);

    this.numbers.forEach((item, index) => {
      let twoStepOfTheRadius = radius * 2;
      let itemRadius = radius * index;
      // since number 1 (0deg location rendered at right of the center of the circle (right angle))
      // we have to deduct two step to make it -60 deg();
      itemRadius = itemRadius - twoStepOfTheRadius;
      
      item.posX = Math.round(distance * Math.cos(itemRadius*(Math.PI/180)));
      item.posY = Math.round(distance * Math.sin(itemRadius*(Math.PI/180)));
    });
  }

  private updateNumberFontSizeAndView(clockWidth: number) {
    if(clockWidth <= 270) {
      this.numberFontSize = NumberFontSizes.extraSmall;
    } else if(clockWidth < 300) {
      this.numberFontSize = NumberFontSizes.small;
    } else if (clockWidth < 430) {
      this.numberFontSize = NumberFontSizes.medium;
    } else {
      this.numberFontSize = NumberFontSizes.large;
    }
  }

  private convertToSeconds(hours: number, minutes: number, seconds: number): number {
    const hh = hours * 3600;
    const mm = minutes * 60;
    return hh + mm;
  }
}
