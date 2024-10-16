import { DetailShowingType } from './detail-showing-type.model';
import { Gallery } from './gallery.model';
import { Genre } from './genre.model';
import { UserFavoriteMovie } from './userFavoriteMovie.model';

export class Movie {
  id: number;
  title: string;
  adult: boolean;
  budget: number;
  originalLanguage: string;
  overview: string;
  status: string;
  video: string;
  posterPath: string;
  backdropPath: string;
  voteAverage: number;
  voteCount: number;
  runtime: number;
  releaseDate: string;
  deleteFlag: boolean;
  genres: Array<Genre>;
  monthToSchedule: number;
  yearToSchedule: number;
  totalShowings: number;
  totalDateShowingsInMonth: number;
  priceEachSeat: number;
  detailShowingTypes: Array<DetailShowingType>;
  galleries: Array<Gallery>;
  userFavoriteMovies: Array<UserFavoriteMovie>;

  constructor() {
    this.id = 0;
    this.title = '';
    this.adult = false;
    this.budget = 0;
    this.originalLanguage = 'en';
    this.overview = '';
    this.status = 'Released';
    this.video = '';
    this.posterPath = '';
    this.backdropPath = '';
    this.voteAverage = 0;
    this.voteCount = 0;
    this.runtime = 0;
    this.releaseDate = '';
    this.deleteFlag = false;
    this.genres = [];
    this.monthToSchedule = 0;
    this.yearToSchedule = 0;
    this.totalShowings = 0;
    this.totalDateShowingsInMonth = 0;
    this.priceEachSeat = 0;
    this.detailShowingTypes = [];
    this.galleries = [];
    this.userFavoriteMovies = [];
  }
}
