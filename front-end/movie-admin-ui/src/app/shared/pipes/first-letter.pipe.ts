import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter',
  standalone: true,
})
export class FirstLetterPipe implements PipeTransform {
  transform(value: string, ...args: string[]): string {
    if (value.length === 0) return 'A';
    return value.slice(0, 1).toUpperCase();
  }
}
