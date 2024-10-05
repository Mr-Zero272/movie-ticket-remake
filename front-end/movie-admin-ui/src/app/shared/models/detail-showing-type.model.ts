export class DetailShowingType {
  id: number | null;
  name: string;
  showings: number;
  constructor(id: number | null, name: string, showings: number) {
    this.id = id;
    this.name = name;
    this.showings = showings;
  }
}
