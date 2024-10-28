export class Ticket {
  public id: string;
  public seatId: string;
  public movieTitle: string;
  public moviePoster: string;
  public date: string;
  public runtime: number;
  public seatNumber: number;
  public seatRow: string;
  public price: number;
  public hall: string;
  public address: string;
  public showingId: number;
  public createdAt: string;
  public orderId: string;

  constructor(
    id: string,
    seatId: string,
    movieTitle: string,
    moviePoster: string,
    date: string,
    runtime: number,
    seatNumber: number,
    seatRow: string,
    price: number,
    hall: string,
    address: string,
    showingId: number,
    createdAt: string,
    orderId: string,
  ) {
    this.id = id;
    this.seatId = seatId;
    this.movieTitle = movieTitle;
    this.moviePoster = moviePoster;
    this.date = date;
    this.runtime = runtime;
    this.seatNumber = seatNumber;
    this.seatRow = seatRow;
    this.price = price;
    this.hall = hall;
    this.address = address;
    this.showingId = showingId;
    this.createdAt = createdAt;
    this.orderId = orderId;
  }
}
