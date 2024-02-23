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

  date: string = '';
  time: string = '';
  validDatetime: string = '';
  userTz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.updateCountdown();
    setInterval(() => {
      this.updateCountdown();
    }, 1000);

    this.eventDate();

  }

  updateCountdown() {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const now = Date.now();
    const diff = this.timestamp - now;

    if (diff > 0) {
      this.days = this.formatTime(diff / DAY);
      this.hours = this.formatTime((diff % DAY) / HOUR);
      this.minutes = this.formatTime((diff % HOUR) / MINUTE);
      this.seconds = this.formatTime((diff % MINUTE) / SECOND);
    } else {
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
      this.date = `${dayExact}`;
    }

    const timeFormatOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: USER_TZ,
      timeZoneName: 'short',
    };

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      timeZone: USER_TZ,
    };

    const validDatetimeAttrOptions: Intl.DateTimeFormatOptions = {
      timeZone: USER_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
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

    const validDatetime = new Intl.DateTimeFormat('en-CA', validDatetimeAttrOptions).format(date);

    if ($dateSpan != null && $timeSpan != null) {
      this.renderer.setProperty($timeSpan, 'innerHTML', time);
      this.renderer.setAttribute($timeSpan, 'datetime', validDatetime);
    }
  }

}
