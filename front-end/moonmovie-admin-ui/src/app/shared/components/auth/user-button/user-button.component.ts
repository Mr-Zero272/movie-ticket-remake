import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [RouterLink, NgIf, OutsideClickDirective],
  templateUrl: './user-button.component.html',
  styleUrl: './user-button.component.css',
})
export class UserButtonComponent {
  isMenuOpen: boolean = false;

  toggleUserMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
