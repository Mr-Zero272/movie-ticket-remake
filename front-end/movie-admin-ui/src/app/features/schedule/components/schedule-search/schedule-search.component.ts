import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroClock, heroMagnifyingGlass, heroXCircle } from '@ng-icons/heroicons/outline';
import { debounceTime, Subject } from 'rxjs';
import { RecommendServiceService } from '../../../../shared/services/recommend-service.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-search',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgIconComponent],
  templateUrl: './schedule-search.component.html',
  styleUrl: './schedule-search.component.scss',
  viewProviders: [
    provideIcons({
      heroXCircle,
      heroMagnifyingGlass,
      heroClock,
    }),
  ],
})
export class ScheduleSearchComponent implements OnInit {
  @Output() onSearch = new EventEmitter<string>();
  historyKeywords: Array<string> = [];
  keywords: Array<string> = [];
  loading: boolean = false;
  recommendKeywords: Array<string> = [];
  searchInput = new Subject<string>();
  searchValue: string = '';

  constructor(private recommendService: RecommendServiceService) {
    this.searchInput.pipe(debounceTime(500)).subscribe((searchTerm: string) => {
      this.onSearch.emit(searchTerm);
      if (searchTerm === '') {
        this.recommendKeywords = this.historyKeywords;
      } else {
        this.recommendService.fetchRecommendKeywords(searchTerm).subscribe((data) => {
          this.recommendKeywords = Array.from(new Set(data)).slice(0, 10);
        });
      }
    });
  }

  ngOnInit(): void {
    this.recommendService.fetchHistoryKeywords().subscribe((data) => {
      this.historyKeywords = data;
      this.recommendKeywords = data;
    });
  }

  onSearchInputChange(event: Event) {
    this.searchInput.next((event.target as HTMLInputElement).value);
  }

  handleSetSearchValue(value: string) {
    this.searchValue = value;
    this.onSearch.emit(value);
  }
}
