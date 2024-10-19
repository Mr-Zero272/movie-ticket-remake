import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserButtonComponent } from '../../auth/user-button/user-button.component';
import { BreadcrumbsComponent } from '../../ui/breadcrumbs/breadcrumbs.component';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBars3BottomLeft, heroBell, heroMoon } from '@ng-icons/heroicons/outline';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { SearchComponent } from '../../ui/search/search.component';
import { SearchHiddenInputComponent } from '../../ui/search-hidden-input/search-hidden-input.component';

import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    UserButtonComponent,
    BreadcrumbsComponent,
    NgIconComponent,
    SearchComponent,
    SearchHiddenInputComponent,
    MatToolbarModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  viewProviders: [
    provideIcons({
      heroBell,
      heroMoon,
      heroBars3BottomLeft,
    }),
  ],
})
export class HeaderComponent {
  @Input() toggleSidebar!: () => void;
  constructor(private sidebarService: SidebarService) {}

  handleToggleSideBar() {
    this.sidebarService.toggleSidebar();
  }
}
