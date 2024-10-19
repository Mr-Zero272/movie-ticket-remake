import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [OutsideClickDirective, NgIf],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css',
})
export class DropdownMenuComponent {
  @Input() isMenuOpen: boolean = false;

  tempOpen: boolean = true;

  toggleUserMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
