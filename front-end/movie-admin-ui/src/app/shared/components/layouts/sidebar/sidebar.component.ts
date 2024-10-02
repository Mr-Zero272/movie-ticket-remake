import { Component, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  navRoutes = routes;
  isOpen: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.sidebarState.subscribe((state) => {
      this.isOpen = state;
    });
  }

  handleToggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
