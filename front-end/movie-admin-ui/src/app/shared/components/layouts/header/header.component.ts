import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserButtonComponent } from '../../auth/user-button/user-button.component';
import { BreadcrumbsComponent } from '../../ui/breadcrumbs/breadcrumbs.component';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBell, heroMoon } from '@ng-icons/heroicons/outline';
import { SidebarService } from '../../../../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterLink, UserButtonComponent, BreadcrumbsComponent, NgIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  viewProviders: [
    provideIcons({
      heroBell,
      heroMoon,
    }),
  ],
})
export class HeaderComponent {
  constructor(private sidebarService: SidebarService) {}

  handleToggleSideBar() {
    this.sidebarService.toggleSidebar();
  }
}
