import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TabsComponent } from '../../../../shared/components/ui/tabs/tabs.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { Column, Sort } from '../../../../shared/models/table';
import { MovieHorizontalCardComponent } from '../../../../shared/components/cards/movie-horizontal-card/movie-horizontal-card.component';
import { moviesPagination } from '../../../../shared/data/movies';
import { MovieService } from '../../services/movie.service';
import { debounceTime, Subject } from 'rxjs';
import { Movie } from '../../../../shared/models/movie.model';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { LabelAndValue } from '../../../../shared/models/labelAndValue';
import { Genre } from '../../../../shared/models/genre.model';

@Component({
    selector: 'app-movies',
    standalone: true,
    imports: [RouterLink, RouterOutlet, TabsComponent, ButtonComponent, TableComponent, MovieHorizontalCardComponent],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.css',
})
export class MoviesComponent implements AfterViewInit, OnInit {
    columns: Array<Column> = [];
    moviesData!: Pagination<Movie>;
    currentSearchValue: string = '';
    loading: boolean = false;
    tabsData: LabelAndValue[] = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Action',
            value: 28,
        },
        {
            label: 'Adventure',
            value: 12,
        },
        {
            label: 'Drama',
            value: 18,
        },
        {
            label: 'Thriller',
            value: 53,
        },
        {
            label: 'Crime',
            value: 80,
        },
    ];
    activeTab: LabelAndValue = this.tabsData[0];
    sortData: Array<Sort> = [
        {
            label: 'Title',
            key: 'title',
            order: 'asc',
        },
        {
            label: 'Status',
            key: 'status',
            order: 'asc',
        },
        {
            label: 'Vote Average',
            key: 'voteAverage',
            order: 'asc',
        },
        {
            label: 'Release Date',
            key: 'releaseDate',
            order: 'asc',
        },
        {
            label: 'Budget',
            key: 'budget',
            order: 'asc',
        },
    ];
    activeSort: Sort = this.sortData[0];
    @ViewChild('movieTemplate', { static: true }) movieTemplate!: TemplateRef<any>;
    @ViewChild('movieTemplateLoading', { static: true }) movieTemplateLoading!: TemplateRef<any>;

    constructor(
        private cdr: ChangeDetectorRef,
        private movieService: MovieService,
    ) {}

    ngOnInit(): void {
        this.handleFetchMovies({});
    }

    ngAfterViewInit(): void {
        this.columns = [
            { label: 'Movie', key: 'title', template: this.movieTemplate, templateLoading: this.movieTemplateLoading },
            { label: 'Status', key: 'status' }, // Default rendering
            { label: 'Vote Average', key: 'voteAverage' },
            { label: 'Release Date', key: 'releaseDate' },
            { label: 'Budget', key: 'budget' },
        ];
        this.cdr.detectChanges();
    }

    handleFetchMovies({
        q = '',
        page = 1,
        size = 7,
        originalLanguage = 'en',
        status = 'Released',
    }: {
        q?: string;
        page?: number;
        size?: number;
        originalLanguage?: string;
        status?: string;
    }) {
        if (this.loading) {
            return;
        }
        this.loading = true;
        if (this.activeTab.value === 'all') {
            this.movieService
                .fetchMovies({
                    q: this.currentSearchValue,
                    page,
                    size,
                    originalLanguage,
                    status,
                    genreId: 0,
                    sort: this.activeSort.key,
                    sortOrder: this.activeSort.order,
                })
                .subscribe((data) => {
                    this.moviesData = data;
                }).closed;
        } else {
            this.movieService
                .fetchMovies({
                    q: this.currentSearchValue,
                    page,
                    size,
                    originalLanguage,
                    status,
                    genreId: this.activeTab.value as number,
                    sort: this.activeSort.key,
                    sortOrder: this.activeSort.order,
                })
                .subscribe((data) => {
                    this.moviesData = data;
                }).closed;
        }

        this.loading = false;
    }

    handleChangePage(page: number) {
        this.handleFetchMovies({
            page: page,
        });
    }

    handleSearchChange(searchTerm: string) {
        this.currentSearchValue = searchTerm;
        this.handleFetchMovies({});
    }

    handleChangeSort(sort: Sort) {
        this.activeSort = sort;
        this.handleFetchMovies({});
    }

    handleChooseTab(tab: LabelAndValue) {
        this.activeTab = tab;
        this.handleFetchMovies({});
    }

    handleDisplayGenre(genres: Array<Genre>): string {
        if (this.activeTab && this.activeTab.value !== 'all' && genres.some((g) => g.id === this.activeTab?.value)) {
            return this.activeTab.label;
        } else {
            return genres[0].name;
        }
    }
}
