export class EditShowingRequest {
  oldAuditoriumId: string;
  oldDate: string;
  oldPosition: number;
  newAuditoriumId: string;
  newDate: string;
  newPosition: number;

  constructor(
    oldAuditoriumId: string,
    oldDate: string,
    oldPosition: number,
    newAuditoriumId: string,
    newDate: string,
    newPosition: number,
  ) {
    this.oldAuditoriumId = oldAuditoriumId;
    this.oldDate = oldDate;
    this.oldPosition = oldPosition;
    this.newAuditoriumId = newAuditoriumId;
    this.newDate = newDate;
    this.newPosition = newPosition;
  }
}
