import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, inject, Inject, Input, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEllipsisHorizontal, heroPlay } from '@ng-icons/heroicons/outline';
import { MarqueeTextComponent } from '../../ui/marquee-text/marquee-text.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteShowingDialogComponent } from '../../../../features/schedule/components/delete-showing-dialog/delete-showing-dialog.component';

@Component({
  selector: 'app-movie-vertical-card',
  standalone: true,
  imports: [NgIconComponent, NgIf, NgClass, MarqueeTextComponent, DatePipe, MatMenuModule, RouterLink, NgFor],
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
  @Input() menu: { label: string; action: () => void }[] = [];

  getPosterBackground(poster: string) {
    return "bg-[url('" + poster + "')]";
  }
}
