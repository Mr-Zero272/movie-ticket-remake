import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-schedule-vertical-card',
  standalone: true,
  imports: [NgClass, NgIf, DatePipe],
  templateUrl: './movie-schedule-vertical-card.component.html',
  styleUrl: './movie-schedule-vertical-card.component.css',
})
export class MovieScheduleVerticalCardComponent {
  @Input() loading: boolean = false;
  @Input() startTime: string = '';
  @Input() title: string = '';
  @Input() runTime: number = 0;
  @Input() firstGenre: string = '';
  @Input() overview: string = '';
  @Input() type: string = '';
  @Input() poster: string = '';
}
