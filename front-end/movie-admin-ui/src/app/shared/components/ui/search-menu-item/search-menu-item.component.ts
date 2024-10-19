import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-menu-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './search-menu-item.component.html',
  styleUrl: './search-menu-item.component.scss',
})
export class SearchMenuItemComponent {
  @Input() isFocused: boolean = false;
}
