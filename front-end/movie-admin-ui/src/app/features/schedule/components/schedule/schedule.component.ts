import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component';
import { MovieHorizontalCardComponent } from '../../../../shared/components/cards/movie-horizontal-card/movie-horizontal-card.component';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ScheduleSearchComponent } from '../schedule-search/schedule-search.component';
import { MovieVerticalCardComponent } from '../../../../shared/components/cards/movie-vertical-card/movie-vertical-card.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { Showing } from '../../../../shared/models/showing.model';
import { ScheduleService } from '../../services/schedule.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePickerComponent,
    MovieHorizontalCardComponent,
    DatePipe,
    ScheduleSearchComponent,
    MovieVerticalCardComponent,
    PaginationComponent,
    NgIconComponent,
    ButtonComponent,
    MatTooltipModule,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  viewProviders: [
    provideIcons({
      heroXCircle,
      heroPlus,
    }),
  ],
})
export class ScheduleComponent implements OnInit {
  showingData: Pagination<Showing> = new Pagination<Showing>([], 1, 10, 1, 1);
  activeDate: string = new Date().toISOString().split('T')[0] + 'T00:00:00';
  loading: boolean = false;
  searchValue: string = '';
  page: number = 1;

  constructor(private showingService: ScheduleService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const params = {
      query: this.searchValue,
      date: this.activeDate,
      page: this.page,
      size: 10,
    };
    if (this.loading) return;
    this.loading = true;
    this.showingService.fetchShowings(params).subscribe((data) => {
      console.log(data);

      this.showingData = data;
    }).closed;
    this.loading = false;
  }

  handleChangeDate(date: string) {
    this.activeDate = date;
    this.loadData();
  }

  handleSearchKeywordChange(searchKeyword: string) {
    this.searchValue = searchKeyword;
    this.loadData();
  }

  handleChangePage(page: number) {
    if (this.loading) return;
    this.loading = true;
    this.showingService
      .fetchShowings({ query: this.searchValue, date: this.activeDate, page: page, size: 10 })
      .subscribe((data) => {
        this.showingData = data;
      }).closed;
    this.loading = false;
  }
}
