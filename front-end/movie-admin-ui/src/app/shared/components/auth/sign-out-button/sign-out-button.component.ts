import { Component, Input } from '@angular/core';
import { User } from '../../../models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sign-out-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sign-out-button.component.html',
  styleUrl: './sign-out-button.component.css',
})
export class SignOutButtonComponent {
  @Input() class: string = '';
  loading: boolean = false;
  user: User | null = null;
  constructor(private authService: AuthService) {
    this.loading = authService.getLoading();
    authService.getUser().subscribe((userData) => {
      this.user = userData;
    });
  }

  get AuthService() {
    return this.authService;
  }
}
