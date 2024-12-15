export class Seat {
  public id: string;
  public rowSeat: string;
  public numberSeat: number;
  public status: string;

  constructor(id: string, rowSeat: string, numberSeat: number, status: string) {
    this.id = id;
    this.rowSeat = rowSeat;
    this.numberSeat = numberSeat;
    this.status = status;
  }
}
