import { Movie } from './movie.model';

export class Showing {
  id: number;
  startTime: string;
  type: string;
  auditoriumId: string;
  priceEachSeat: number;
  movie: Movie;

  constructor(id: number, startTime: string, type: string, auditoriumId: string, priceEachSeat: number, movie: Movie) {
    this.id = id;
    this.startTime = startTime;
    this.type = type;
    this.auditoriumId = auditoriumId;
    this.priceEachSeat = priceEachSeat;
    this.movie = movie;
  }
}
