import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {
  transform(ticks: number): string {
    if (!ticks) return '0s';

    // Convert ticks to milliseconds (assuming ticks are in 100-nanosecond units)
    const ms = ticks / 10000;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
    if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

    return parts.join(' ') || '0s';
  }
}
