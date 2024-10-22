import { NgClass, NgIf } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../models/auth.model';
import { SignOutButtonComponent } from '../sign-out-button/sign-out-button.component';
import { DropdownMenuItemComponent } from '../../ui/dropdown-menu-item/dropdown-menu-item.component';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [RouterLink, NgIf, OutsideClickDirective, SignOutButtonComponent, DropdownMenuItemComponent],
  templateUrl: './user-button.component.html',
  styleUrl: './user-button.component.css',
})
export class UserButtonComponent {
  isMenuOpen: boolean = false;
  user: User | null = null;
  profileImg: string = '';

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
  ) {
    this.authService.getUser().subscribe((userInfo) => {
      this.user = userInfo;
      this.profileImg = userInfo?.avatar || '';
    });
  }

  toggleUserMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  onErrorProfileImage() {
    this.profileImg = 'http://localhost:8272/api/v2/moon-movie/media/images/user-avatar.png';
  }
}
