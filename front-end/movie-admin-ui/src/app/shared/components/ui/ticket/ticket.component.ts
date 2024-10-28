import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent {
  @Input() id: string = '';
  @Input() seatId: string = '';
  @Input() movieTitle: string = '';
  @Input() moviePoster: string = '';
  @Input() date: string = '2024-01-01T00:00:00';
  @Input() runtime: number = 27;
  @Input() seatNumber: number = 1;
  @Input() seatRow: string = '';
  @Input() price: number = 27;
  @Input() hall: string = '';
  @Input() address: string = '';
  @Input() showingId: number = 1;
  @Input() createdAt: string = '2024-01-01T00:00:00';
  @Input() active: boolean = false;
}
