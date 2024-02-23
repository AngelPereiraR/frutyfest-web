import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  @Input() timestamp: number = 0;

  days: string = '01';
  hours: string = '01';
  minutes: string = '01';
  seconds: string = '01';

  userTz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.updateCountdown();
    this.eventDate();
    setInterval(() => {
      this.updateCountdown();
      this.eventDate();
    }, 1000);

  }

  updateCountdown() {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const now = Date.now();
    const diff = this.timestamp - now;


    const $days = this.elementRef.nativeElement.querySelector('.data-days');
    const $hours = this.elementRef.nativeElement.querySelector('.data-hours');
    const $minutes = this.elementRef.nativeElement.querySelector('.data-minutes');
    const $seconds = this.elementRef.nativeElement.querySelector('.data-seconds');

    if (diff > 0 && $days != null && $hours != null && $minutes != null && $seconds != null) {
      this.renderer.setProperty($days, 'innerHTML', `${this.formatTime(diff / DAY)} días`);
      this.renderer.setProperty($hours, 'innerHTML', `${this.formatTime((diff % DAY) / HOUR)} horas`);
      this.renderer.setProperty($minutes, 'innerHTML', `${this.formatTime((diff % HOUR) / MINUTE)} minutos`);
      this.renderer.setProperty($seconds, 'innerHTML', `${this.formatTime((diff % MINUTE) / SECOND)} segundos`);
    } else if(diff < 0 && $days != null && $hours != null && $minutes != null && $seconds != null) {
      this.days = '00';
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';
    }
  }

  formatTime(time: number): string {
    return Math.floor(time).toString().padStart(2, '0');
  }

  eventDate() {
    const $dateSpan = this.elementRef.nativeElement.querySelector('.date');
    const $timeSpan = this.elementRef.nativeElement.querySelector('.time');

    const USER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date(this.timestamp);

    // Obtener el día exacto del timestamp
    const dayOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      timeZone: USER_TZ,
    };

    const dayExact = new Intl.DateTimeFormat('es-ES', dayOptions).format(date);

    if ($dateSpan != null) {
      this.renderer.setProperty($dateSpan, 'innerHTML', dayExact);
    }

    const timeFormatOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: USER_TZ,
      timeZoneName: 'short',
    };

    const time = new Intl.DateTimeFormat('en-GB', timeFormatOptions)
      .formatToParts(date)
      .map(({ type, value }) => {
        if (type === 'literal' && value === ' ') {
          return 'H ';
        }
        return value;
      })
      .join('');

    if ($dateSpan != null && $timeSpan != null) {
      this.renderer.setProperty($timeSpan, 'innerHTML', time);
    }
  }

}
