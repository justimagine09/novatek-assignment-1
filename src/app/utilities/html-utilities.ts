import { Observable } from "rxjs";

export class HtmlUtilities {
  static resizeObserver(element: HTMLElement) {
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((callback) => {
        subscriber.next(callback)
      });
  
      observer.observe(element);
  
      return {unsubscribe: () => observer.disconnect()}
    });
  }
}