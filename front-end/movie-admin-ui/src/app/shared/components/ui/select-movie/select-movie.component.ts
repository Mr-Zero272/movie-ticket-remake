import { NgFor, NgIf } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, retry, Subject } from 'rxjs';
import { Movie } from '../../../models/movie.model';
import { MovieHorizontalCardComponent } from '../../cards/movie-horizontal-card/movie-horizontal-card.component';
import { Genre } from '../../../models/genre.model';
import { MovieService } from '../../../../features/movies/services/movie.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-select-movie',
  standalone: true,
  imports: [FormsModule, NgFor, MovieHorizontalCardComponent, NgIf, ButtonComponent],
  templateUrl: './select-movie.component.html',
  styleUrl: './select-movie.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMovieComponent),
      multi: true,
    },
  ],
})
export class SelectMovieComponent implements ControlValueAccessor, OnInit {
  searchValue: string = '';
  searchInput = new Subject<string>();
  movies: Array<Movie> = [];
  loading: boolean = true;
  currentPage: number = 1;
  hasNextPage: boolean = true;
  activeMovie: Movie | null = null;

  constructor(private movieService: MovieService) {
    this.searchInput.pipe(debounceTime(500)).subscribe((searchTerm: string) => {
      this.currentPage = 1;
      this.handleFetchMovie(searchTerm);
    });
  }

  ngOnInit(): void {
    this.handleFetchMovie('');
  }

  handleFetchMovie(searchTerm: string) {
    if (!this.hasNextPage && this.loading) {
      return;
    }

    this.loading = true;
    this.movieService.fetchMovies({ q: searchTerm, size: 8, page: this.currentPage }).subscribe((data) => {
      this.movies = data.data;
      this.hasNextPage = data.totalPages > data.page;
      if (this.hasNextPage) {
        this.currentPage = this.currentPage + 1;
      }
    });
    this.loading = false;
  }

  handleFetchMore() {
    if (!this.hasNextPage && this.loading) {
      return;
    }

    this.loading = true;
    this.movieService.fetchMovies({ q: this.searchValue, size: 8, page: this.currentPage }).subscribe((data) => {
      this.movies = [...this.movies, ...data.data];
      this.hasNextPage = data.totalPages > data.page;
      if (this.hasNextPage) {
        this.currentPage = this.currentPage + 1;
      }
    });
    this.loading = false;
  }

  handleChooseMovie(movie: Movie) {
    this.activeMovie = movie;
    this.onChange(movie);
  }

  handleSearchInputChange(event: Event) {
    this.searchInput.next((event.target as HTMLInputElement).value);
  }

  handleDisplayGenre(genres: Array<Genre>): string {
    return genres[0] ? genres[0].name : 'unknown';
  }

  onChange(movie: Movie) {}
  onTouched = () => {};

  writeValue(movie: Movie): void {
    this.activeMovie = movie;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  reset(): void {
    this.activeMovie = null;
  }
}
