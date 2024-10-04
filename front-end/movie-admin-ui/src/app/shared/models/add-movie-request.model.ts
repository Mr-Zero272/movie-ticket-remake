import { DetailShowingType } from './detail-showing-type.model';

export interface AddMovieRequest {
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
  detailShowingTypes: Array<{ name: string; showings: number }>;
  galleries: string[];
}
