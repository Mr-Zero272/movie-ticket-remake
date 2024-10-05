import { AddMovieRequest } from './add-movie-request.model';
import { DetailShowingType } from './detail-showing-type.model';

export class AddMovieRequestBuilder {
  private addMovieRequest: AddMovieRequest;

  constructor() {
    this.addMovieRequest = new AddMovieRequest();
  }

  /**
   * Setter title
   * @param {string} value
   */
  public setTitle(value: string) {
    this.addMovieRequest.title = value;
    return this;
  }

  /**
   * Setter adult
   * @param {boolean} value
   */
  public setAdult(value: boolean) {
    this.addMovieRequest.adult = value;
    return this;
  }

  /**
   * Setter budget
   * @param {number} value
   */
  public setBudget(value: number) {
    this.addMovieRequest.budget = value;
    return this;
  }

  /**
   * Setter originalLanguage
   * @param {string} value
   */
  public setOriginalLanguage(value: string) {
    this.addMovieRequest.originalLanguage = value;
    return this;
  }

  /**
   * Setter overview
   * @param {string} value
   */
  public setOverview(value: string) {
    this.addMovieRequest.overview = value;
    return this;
  }

  /**
   * Setter status
   * @param {string} value
   */
  public setStatus(value: string) {
    this.addMovieRequest.status = value;
    return this;
  }

  /**
   * Setter video
   * @param {string} value
   */
  public setVideo(value: string) {
    this.addMovieRequest.video = value;
    return this;
  }

  /**
   * Setter posterPath
   * @param {string} value
   */
  public setPosterPath(value: string) {
    this.addMovieRequest.posterPath = value;
    return this;
  }

  /**
   * Setter backdropPath
   * @param {string} value
   */
  public setBackdropPath(value: string) {
    this.addMovieRequest.backdropPath = value;
    return this;
  }

  /**
   * Setter voteAverage
   * @param {number} value
   */
  public setVoteAverage(value: number) {
    this.addMovieRequest.voteAverage = value;
    return this;
  }

  /**
   * Setter voteCount
   * @param {number} value
   */
  public setVoteCount(value: number) {
    this.addMovieRequest.voteCount = value;
    return this;
  }

  /**
   * Setter runtime
   * @param {number} value
   */
  public setRuntime(value: number) {
    this.addMovieRequest.runtime = value;
    return this;
  }

  /**
   * Setter releaseDate
   * @param {string} value
   */
  public setReleaseDate(value: string) {
    this.addMovieRequest.releaseDate = value;
    return this;
  }

  /**
   * Setter genreIds
   * @param {number[]} value
   */
  public setGenreIds(value: number[]) {
    this.addMovieRequest.genreIds = value;
    return this;
  }

  /**
   * Setter monthToSchedule
   * @param {number} value
   */
  public setMonthToSchedule(value: number) {
    this.addMovieRequest.monthToSchedule = value;
    return this;
  }

  /**
   * Setter yearToSchedule
   * @param {number} value
   */
  public setYearToSchedule(value: number) {
    this.addMovieRequest.yearToSchedule = value;
    return this;
  }

  /**
   * Setter totalShowings
   * @param {number} value
   */
  public setTotalShowings(value: number) {
    this.addMovieRequest.totalShowings = value;
    return this;
  }

  /**
   * Setter totalDateShowingsInMonth
   * @param {number} value
   */
  public setTotalDateShowingsInMonth(value: number) {
    this.addMovieRequest.totalDateShowingsInMonth = value;
    return this;
  }

  /**
   * Setter priceEachSeat
   * @param {number} value
   */
  public setPriceEachSeat(value: number) {
    this.addMovieRequest.priceEachSeat = value;
    return this;
  }

  /**
   * Setter detailShowingTypes
   * @param {DetailShowingType} value
   */
  public setDetailShowingTypes(value: Array<DetailShowingType>) {
    this.addMovieRequest.detailShowingTypes = value;
    return this;
  }

  /**
   * Setter galleries
   * @param {string[]} value
   */
  public setGalleries(value: string[]) {
    this.addMovieRequest.galleries = value;
    return this;
  }

  public build() {
    return this.addMovieRequest;
  }
}
