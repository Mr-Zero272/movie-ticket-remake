import { Component, inject, OnInit } from '@angular/core';
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
import { heroCalendarDays, heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DeleteShowingDialogComponent } from '../delete-showing-dialog/delete-showing-dialog.component';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePickerComponent,
    ScheduleSearchComponent,
    MovieVerticalCardComponent,
    PaginationComponent,
    NgIconComponent,
    ButtonComponent,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  viewProviders: [
    provideIcons({
      heroXCircle,
      heroPlus,
      heroCalendarDays,
    }),
  ],
})
export class ScheduleComponent implements OnInit {
  showingData: Pagination<Showing> = new Pagination<Showing>([], 1, 10, 1, 1);
  activeDate: string = new Date().toISOString().split('T')[0];
  loading: boolean = false;
  searchValue: string = '';
  page: number = 1;

  // dialog edit hall information
  readonly dialog = inject(MatDialog);

  constructor(
    private showingService: ScheduleService,
    private router: Router,
    private toastService: ToastService,
    private scheduleService: ScheduleService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const params = {
      query: this.searchValue,
      date: this.activeDate + 'T00:00:00',
      page: this.page,
      size: 10,
    };
    if (this.loading) return;
    this.loading = true;
    this.showingService.fetchShowings(params).subscribe((data) => {
      this.showingData = data;
    }).closed;
    this.loading = false;
  }

  handleChangeDate() {
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
      .fetchShowings({ query: this.searchValue, date: this.activeDate + 'T00:00:00', page: page, size: 10 })
      .subscribe((data) => {
        this.showingData = data;
      }).closed;
    this.loading = false;
  }

  getMenu(showing: Showing) {
    return [
      {
        label: 'Detail',
        action: () => {
          console.log('444');
          this.router.navigate(['/showing/' + showing.id]);
        },
      },
      {
        label: 'Delete',
        action: () => {
          this.openDeleteDialog(showing.id);
          console.log('123');
        },
      },
    ];
  }

  openDeleteDialog(showingId: number): void {
    const dialogRef = this.dialog.open(DeleteShowingDialogComponent, {
      data: { showingId: showingId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== '') {
        this.scheduleService.deleteShowing(+result).subscribe({
          error: (err) => {
            this.toastService.showToast('danger', 'Cannot delete this showing!!!');
          },
          next: () => {
            this.toastService.showToast('success', 'Delete successfully!');
            this.showingData.data = this.showingData.data.filter((s) => s.id !== showingId);
            this.showingData.totalElements = this.showingData.totalElements - 1;
          },
        }).closed;
      }
    });
  }
}
