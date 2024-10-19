import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SignOutButtonComponent } from '../../auth/sign-out-button/sign-out-button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroCalendar,
  heroCog6Tooth,
  heroChartPie,
  heroVideoCamera,
  heroPresentationChartBar,
  heroUsers,
  heroArrowRightOnRectangle,
  heroSquares2x2,
  heroCubeTransparent,
  heroDocumentText,
  heroTicket,
} from '@ng-icons/heroicons/outline';
import { routes } from '../../../constants/routes';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatTooltipModule,
    SignOutButtonComponent,
    NgIconComponent,
    NgFor,
    NgIf,
    NgClass,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  viewProviders: [
    provideIcons({
      heroHome,
      heroCalendar,
      heroCog6Tooth,
      heroChartPie,
      heroVideoCamera,
      heroPresentationChartBar,
      heroUsers,
      heroArrowRightOnRectangle,
      heroSquares2x2,
      heroCubeTransparent,
      heroDocumentText,
      heroTicket,
    }),
  ],
})
export class SidebarComponent {
  navRoutes = routes;
  isSmallScreen: boolean = window.innerWidth <= 850;

  @Output() close = new EventEmitter<void>();

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth <= 850;
  }

  onItemClick() {
    if (this.isSmallScreen) {
      this.close.emit();
    }
  }
}
