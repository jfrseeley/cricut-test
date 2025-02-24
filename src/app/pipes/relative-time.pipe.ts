import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {


  transform(value: string | null | undefined, ...args: unknown[]): unknown {
    if (value == null) {
      return null;
    }

    const now = new Date();
    const date = new Date(value);
    const milliseconds = now.getTime() - date.getTime();
    const days = milliseconds / (1000 * 60 * 60 * 24);
    if (days < 1) {
      return 'Today';
    }

    if (days < 7) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
    }

    if (days < 30) {
      return 'This Month';
    }

    if (days < 365) {
      const months = (days / 30).toFixed();
      return `${months} Months Ago`;
    }

    const years = (days / 365).toFixed();
    return `${years} Years Ago`;
  }

}
