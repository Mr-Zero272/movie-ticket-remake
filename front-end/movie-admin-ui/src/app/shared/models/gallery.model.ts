export class Gallery {
  private _id: number;
  private _imgUrl: string;

  constructor(id: number, imgUrl: string) {
    this._id = id;
    this._imgUrl = imgUrl;
  }

  /**
   * Getter id
   * @return {number}
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Getter imgUrl
   * @return {string}
   */
  public get imgUrl(): string {
    return this._imgUrl;
  }

  /**
   * Setter id
   * @param {number} value
   */
  public set id(value: number) {
    this._id = value;
  }

  /**
   * Setter imgUrl
   * @param {string} value
   */
  public set imgUrl(value: string) {
    this._imgUrl = value;
  }
}
