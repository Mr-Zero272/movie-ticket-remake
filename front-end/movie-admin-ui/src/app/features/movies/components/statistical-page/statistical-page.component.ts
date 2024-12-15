import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { TicketsSoldStatistical } from '../../../../shared/models/ticket-statistical';
import { MovieService } from '../../services/movie.service';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { MovieHorizontalCardComponent } from '../../../../shared/components/cards/movie-horizontal-card/movie-horizontal-card.component';
import { LabelAndValue } from '../../../../shared/models/labelAndValue';
import { Column, Sort } from '../../../../shared/models/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistical-page',
  standalone: true,
  imports: [ButtonComponent, TableComponent, MovieHorizontalCardComponent],
  templateUrl: './statistical-page.component.html',
  styleUrl: './statistical-page.component.scss',
})
export class StatisticalPageComponent implements OnInit {
  columns: Array<Column> = [];
  hotMoviesData!: Pagination<TicketsSoldStatistical>;
  currentSearchValue: string = '';
  loading: boolean = false;
  sortData: Array<Sort> = [
    {
      label: 'Movie',
      key: 'movieTitle',
      order: 'asc',
    },
    {
      label: 'Sold tickets',
      key: 'totalTicketsSold',
      order: 'asc',
    },
  ];
  activeSort: Sort = this.sortData[0];
  @ViewChild('movieTemplate', { static: true }) movieTemplate!: TemplateRef<any>;
  @ViewChild('movieTemplateLoading', { static: true }) movieTemplateLoading!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.handleFetchTopMovies({});
  }

  ngAfterViewInit(): void {
    this.columns = [
      { label: 'Movie', key: 'movieTitle', template: this.movieTemplate, templateLoading: this.movieTemplateLoading },
      { label: 'Sold tickets', key: 'totalTicketsSold' },
    ];
    this.cdr.detectChanges();
  }

  handleFetchTopMovies({ page = 1, size = 7 }: { page?: number; size?: number }) {
    if (this.loading) return;
    this.loading = true;
    this.movieService
      .getTopHotMovies(this.activeSort.key, this.activeSort.order, page, size)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((data) => {
        this.hotMoviesData = data;
      });
  }

  handleChangePage(page: number) {
    this.handleFetchTopMovies({
      page: page,
    });
  }

  handleChangeSort(sort: Sort) {
    this.activeSort = sort;
    this.handleFetchTopMovies({});
  }
}
