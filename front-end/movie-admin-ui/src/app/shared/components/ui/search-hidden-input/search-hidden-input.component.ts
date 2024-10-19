import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-search-hidden-input',
  standalone: true,
  imports: [NgIf, NgIconComponent, SearchComponent],
  templateUrl: './search-hidden-input.component.html',
  styleUrl: './search-hidden-input.component.scss',
  viewProviders: [
    provideIcons({
      heroMagnifyingGlass,
      heroArrowLeft,
    }),
  ],
})
export class SearchHiddenInputComponent {
  isOpen: boolean = false;

  handleCloseSearch(e: Event) {
    e.stopPropagation();
    this.isOpen = false;
  }
}
