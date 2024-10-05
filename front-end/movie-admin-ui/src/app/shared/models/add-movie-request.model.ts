import { DetailShowingType } from './detail-showing-type.model';

export class AddMovieRequest {
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
  genreIds: number[];
  monthToSchedule: number;
  yearToSchedule: number;
  totalShowings: number;
  totalDateShowingsInMonth: number;
  priceEachSeat: number;
  detailShowingTypes: Array<DetailShowingType>;
  galleries: string[];

  constructor() {
    this.title = '';
    this.adult = false;
    this.budget = 0;
    this.originalLanguage = '';
    this.overview = '';
    this.status = 'Released';
    this.video = '';
    this.posterPath = '';
    this.backdropPath = '';
    this.voteAverage = 0;
    this.voteCount = 0;
    this.runtime = 0;
    this.releaseDate = '';
    this.genreIds = [];
    this.monthToSchedule = 0;
    this.yearToSchedule = 0;
    this.totalShowings = 0;
    this.totalDateShowingsInMonth = 0;
    this.priceEachSeat = 0;
    this.detailShowingTypes = [];
    this.galleries = [];
  }
}
