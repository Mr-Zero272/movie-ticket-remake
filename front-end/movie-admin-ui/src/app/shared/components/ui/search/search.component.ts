import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, debounce, debounceTime } from 'rxjs';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { SearchMenuItemComponent } from '../search-menu-item/search-menu-item.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { LabelAndValue } from '../../../models/labelAndValue';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, OutsideClickDirective, SearchMenuItemComponent, NgIconComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  viewProviders: [
    provideIcons({
      heroMagnifyingGlass,
    }),
  ],
})
export class SearchComponent {
  @Input() class: string = '';
  private listResults: Array<LabelAndValue> = [
    { label: 'dashboard', value: '/' },
    { label: 'schedule', value: '/schedule' },
    { label: 'do schedule', value: '/schedule/manage/do-schedule' },
    { label: 'add new showing', value: '/showing/manage/create' },
    { label: 'users', value: '/users' },
    { label: 'movies', value: '/movies' },
    { label: 'add new movie', value: '/movies/adding' },
    { label: 'halls', value: '/hall' },
    { label: 'genres', value: '/genres' },
    { label: 'orders', value: '/orders' },
    { label: 'profile', value: '/profile' },
  ];
  searchResults: Array<LabelAndValue> = [];
  searchValue = new BehaviorSubject<string>('');
  searchValueDisplay: string = '';
  showResult: boolean = false;
  loading: boolean = false;

  constructor(private router: Router) {
    this.searchValue.pipe(debounceTime(500)).subscribe((searchTerm: string) => {
      if (!searchTerm.trim()) {
        this.searchResults = [];
        return;
      }

      const filter = async () => {
        if (this.loading) return;
        this.loading = true;

        const filterKeyword = new Promise<Array<LabelAndValue>>((resolve, reject) => {
          setTimeout(() => {
            let results = this.listResults.filter((r) =>
              r.label.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
            );
            results = [{ label: searchTerm, value: '' }, ...results];
            resolve(results);
          }, 400);
        });

        this.searchResults = await filterKeyword;
        this.loading = false;
      };

      filter();
    });
  }

  @ViewChild('searchInput') searchInput!: ElementRef;

  handleClear() {
    this.searchValueDisplay = '';
    this.searchResults = [];
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  handleHideResults() {
    this.showResult = false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === '/') {
      event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
  }

  handleSearchInputChange(e: Event) {
    const searchValue = (e.target as HTMLInputElement).value;

    if (!searchValue.startsWith(' ')) {
      this.searchValueDisplay = searchValue;
      this.searchValue.next(searchValue);
    }
  }

  handleOnKeyDown(e: KeyboardEvent) {
    const indexSearchKeyword = this.searchResults.map((rs) => rs.label).indexOf(this.searchValueDisplay);
    const searchResultsLength = this.searchResults.length;

    if (e.key === 'ArrowDown') {
      if (indexSearchKeyword === searchResultsLength - 1) {
        this.searchValueDisplay = this.searchResults[0].label;
      } else if (indexSearchKeyword + 1 < searchResultsLength) {
        this.searchValueDisplay = this.searchResults[indexSearchKeyword + 1].label;
      }
    } else if (e.key === 'ArrowUp') {
      if (indexSearchKeyword === 0) {
        this.searchValueDisplay = this.searchResults[searchResultsLength - 1].label;
      } else {
        this.searchValueDisplay = this.searchResults[indexSearchKeyword - 1].label;
      }
    } else if (e.key === 'Enter') {
      if (this.searchResults[indexSearchKeyword].value !== '') {
        this.router.navigate([this.searchResults[indexSearchKeyword].value]);
      }
      this.showResult = false;
      e.preventDefault();
    }
  }

  handleChooseItem(item: LabelAndValue) {
    this.searchValueDisplay = item.label;
    this.showResult = false;
    if (item.value !== '') {
      this.router.navigate([item.value]);
    }
  }
}
