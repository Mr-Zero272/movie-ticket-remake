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

  constructor(
    id: number,
    title: string,
    adult: boolean,
    budget: number,
    originalLanguage: string,
    overview: string,
    status: string,
    video: string,
    posterPath: string,
    backdropPath: string,
    voteAverage: number,
    voteCount: number,
    runtime: number,
    releaseDate: string,
    deleteFlag: boolean,
    genres: Array<Genre>,
    monthToSchedule: number,
    yearToSchedule: number,
    totalShowings: number,
    totalDateShowingsInMonth: number,
    priceEachSeat: number,
    detailShowingTypes: Array<DetailShowingType>,
    galleries: Array<Gallery>,
    userFavoriteMovies: Array<UserFavoriteMovie>,
  ) {
    this.id = id;
    this.title = title;
    this.adult = adult;
    this.budget = budget;
    this.originalLanguage = originalLanguage;
    this.overview = overview;
    this.status = status;
    this.video = video;
    this.posterPath = posterPath;
    this.backdropPath = backdropPath;
    this.voteAverage = voteAverage;
    this.voteCount = voteCount;
    this.runtime = runtime;
    this.releaseDate = releaseDate;
    this.deleteFlag = deleteFlag;
    this.genres = genres;
    this.monthToSchedule = monthToSchedule;
    this.yearToSchedule = yearToSchedule;
    this.totalShowings = totalShowings;
    this.totalDateShowingsInMonth = totalDateShowingsInMonth;
    this.priceEachSeat = priceEachSeat;
    this.detailShowingTypes = detailShowingTypes;
    this.galleries = galleries;
    this.userFavoriteMovies = userFavoriteMovies;
  }
}
