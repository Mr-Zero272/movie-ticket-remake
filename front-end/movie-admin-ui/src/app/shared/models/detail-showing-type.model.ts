export class DetailShowingType {
  private _name: string;
  private _showings: number;

  constructor(name: string, showings: number) {
    this._name = name;
    this._showings = showings;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter showings
   * @return {number}
   */
  public get showings(): number {
    return this._showings;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter showings
   * @param {number} value
   */
  public set showings(value: number) {
    this._showings = value;
  }
}
