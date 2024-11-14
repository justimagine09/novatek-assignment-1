import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, interval, Observable, of, Subscription, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeServiceService {
  public hours$!: Observable<number>;
  public minutes$!: Observable<number>;
  public seconds$!: Observable<number>;

  private hours$$: BehaviorSubject<number>;
  private minutes$$: BehaviorSubject<number>;
  private seconds$$: BehaviorSubject<number>;
  
  private timerSubscription?: Subscription;

  constructor() {
    this.hours$$ = new BehaviorSubject(0);
    this.minutes$$ = new BehaviorSubject(0);
    this.seconds$$ = new BehaviorSubject(0);

    this.hours$ = this.hours$$.asObservable();
    this.minutes$ = this.minutes$$.asObservable();
    this.seconds$ = this.seconds$$.asObservable();
    this.reset();
  }

  reset() {
    const date = new Date();

    this.hours$$.next(date.getHours());
    this.minutes$$.next(date.getMinutes());
    this.seconds$$.next(date.getSeconds());
    this.startTimer();
  }

  startTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000)
      .subscribe(() => {
        this.incrementSeconds();
      });
  }

  incrementHour() {
    if (this.hours$$.getValue() >= 24) {
      this.hours$$.next(1);
      
      return;
    }
    this.hours$$.next(this.hours$$.getValue() + 1);
  }

  decrementHours() {
    if (this.hours$$.getValue() <= 0) {
      this.hours$$.next(23);
      
      return;
    }

    this.hours$$.next(this.hours$$.getValue() - 1);
  }

  incrementMinutes(dontIncrementHours = true) {
    if (this.minutes$$.getValue() >= 59) {
      this.minutes$$.next(0);

      if (!dontIncrementHours) {
        this.incrementHour();
      }
      return;
    }

    this.minutes$$.next(this.minutes$$.getValue() + 1);
  }

  decrementMinutes() {
    if (this.minutes$$.getValue() <= 0) {
      this.minutes$$.next(59);
      
      return;
    }

    this.minutes$$.next(this.minutes$$.getValue() - 1);
  }

  incrementSeconds() {
    if (this.seconds$$.getValue() >= 59) {
      this.seconds$$.next(0);
      this.incrementMinutes();
      return;
    }

    this.seconds$$.next(this.seconds$$.getValue() + 1);
  }

  getHours() {
    return this.hours$$.getValue();
  }
  
  getMinutes() {
    return this.minutes$$.getValue();
  }
}
