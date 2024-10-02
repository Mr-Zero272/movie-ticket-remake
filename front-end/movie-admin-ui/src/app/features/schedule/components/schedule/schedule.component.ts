import { Component } from '@angular/core';
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component';
import { MovieHorizontalCardComponent } from '../../../../shared/components/cards/movie-horizontal-card/movie-horizontal-card.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [DatePickerComponent, MovieHorizontalCardComponent, DatePipe],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent {}
