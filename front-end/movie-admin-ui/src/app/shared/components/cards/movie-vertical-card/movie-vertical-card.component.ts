import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, forwardRef, Inject, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEllipsisHorizontal, heroPlay } from '@ng-icons/heroicons/outline';
import { MarqueeTextComponent } from '../../ui/marquee-text/marquee-text.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-vertical-card',
  standalone: true,
  imports: [NgIconComponent, NgIf, NgClass, MarqueeTextComponent, DatePipe, MatMenuModule, RouterLink],
  templateUrl: './movie-vertical-card.component.html',
  styleUrl: './movie-vertical-card.component.scss',
  viewProviders: [
    provideIcons({
      heroPlay,
      heroEllipsisHorizontal,
    }),
  ],
})
export class MovieVerticalCardComponent {
  @Input() showingId: number = 0;
  @Input() title: string = '';
  @Input() overview: string = '';
  @Input() startTime: string = new Date().toISOString().split('T')[0] + 'T00:00:00';
  @Input() poster: string = '';
  @Input() loading: boolean = false;

  getPosterBackground(poster: string) {
    return "bg-[url('" + poster + "')]";
  }
}
