import { Location, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCamera,
  heroCheck,
  heroChevronLeft,
  heroEllipsisVertical,
  heroLockClosed,
  heroUser,
} from '@ng-icons/heroicons/outline';
import { ProfileComponent } from '../profile/profile.component';
import { ChangePassComponent } from '../../../auth/component/change-pass/change-pass.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [NgClass, NgIf, MatTooltipModule, NgIconComponent, ProfileComponent, ChangePassComponent, MatMenuModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  viewProviders: [
    provideIcons({
      heroUser,
      heroLockClosed,
      heroChevronLeft,
      heroEllipsisVertical,
      heroCheck,
    }),
  ],
})
export class UserDetailComponent {
  activeTab: 'profile' | 'password' = 'profile';

  constructor(public location: Location) {}

  toggleTab(tab: 'profile' | 'password') {
    if (tab !== this.activeTab) {
      this.activeTab = tab;
    }
  }
}
