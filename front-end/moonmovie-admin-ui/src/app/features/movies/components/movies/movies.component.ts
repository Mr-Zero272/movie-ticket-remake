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

@Component({
    selector: 'app-movies',
    standalone: true,
    imports: [RouterLink, RouterOutlet, TabsComponent, ButtonComponent, TableComponent, MovieHorizontalCardComponent],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.css',
})
export class MoviesComponent implements AfterViewInit, OnInit {
    columns: Array<Column> = [];
    moviesData: Movie[] = [];
    searchInput = new Subject<string>();
    sortDat: Array<Sort> = [
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
    @ViewChild('movieTemplate', { static: true }) movieTemplate!: TemplateRef<any>;

    constructor(
        private cdr: ChangeDetectorRef,
        private movieService: MovieService,
    ) {
        this.searchInput.pipe(debounceTime(500)).subscribe((searchTerm: string) => {
            // Call your search function here
            this.performSearch(searchTerm);
        });
    }

    ngOnInit(): void {
        this.movieService.fetchMovies({ page: 1, size: 5, sort: 'title', sortOrder: 'asc' }).subscribe((data) => {
            this.moviesData = data.data;
        });
    }

    ngAfterViewInit(): void {
        this.columns = [
            { label: 'Movie', key: 'title', template: this.movieTemplate },
            { label: 'Status', key: 'status' }, // Default rendering
            { label: 'Vote Average', key: 'voteAverage' },
            { label: 'Release Date', key: 'releaseDate' },
            { label: 'Budget', key: 'budget' },
        ];
        this.cdr.detectChanges();
    }

    handleChangePage(page: number) {
        this.moviesData = this.moviesData.slice(0, 3);
        console.log('change');
        console.log(this.moviesData.length);
    }

    performSearch(searchTerm: string) {
        console.log(searchTerm);
    }
}
