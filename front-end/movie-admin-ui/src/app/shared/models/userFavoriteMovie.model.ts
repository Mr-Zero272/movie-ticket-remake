export class UserFavoriteMovie {
  id: number;
  userId: string;
  dateAdded: string;

  constructor(id: number, userId: string, dateAdded: string) {
    this.id = id;
    this.userId = userId;
    this.dateAdded = dateAdded;
  }
}
