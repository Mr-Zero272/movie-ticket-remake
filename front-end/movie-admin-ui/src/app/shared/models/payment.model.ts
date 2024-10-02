export class Payment {
  private _invoiceId: string;
  private _total: number;
  private _paymentStatus: string;
  private _method: string;
  private _description: string;
  private _timestamp: string;

  constructor(
    invoiceId: string,
    total: number,
    paymentStatus: string,
    method: string,
    description: string,
    timestamp: string,
  ) {
    this._invoiceId = invoiceId;
    this._total = total;
    this._paymentStatus = paymentStatus;
    this._method = method;
    this._description = description;
    this._timestamp = timestamp;
  }

  /**
   * Getter invoiceId
   * @return {string}
   */
  public get invoiceId(): string {
    return this._invoiceId;
  }

  /**
   * Getter total
   * @return {number}
   */
  public get total(): number {
    return this._total;
  }

  /**
   * Getter paymentStatus
   * @return {string}
   */
  public get paymentStatus(): string {
    return this._paymentStatus;
  }

  /**
   * Getter method
   * @return {string}
   */
  public get method(): string {
    return this._method;
  }

  /**
   * Getter description
   * @return {string}
   */
  public get description(): string {
    return this._description;
  }

  /**
   * Getter timestamp
   * @return {string}
   */
  public get timestamp(): string {
    return this._timestamp;
  }

  /**
   * Setter invoiceId
   * @param {string} value
   */
  public set invoiceId(value: string) {
    this._invoiceId = value;
  }

  /**
   * Setter total
   * @param {number} value
   */
  public set total(value: number) {
    this._total = value;
  }

  /**
   * Setter paymentStatus
   * @param {string} value
   */
  public set paymentStatus(value: string) {
    this._paymentStatus = value;
  }

  /**
   * Setter method
   * @param {string} value
   */
  public set method(value: string) {
    this._method = value;
  }

  /**
   * Setter description
   * @param {string} value
   */
  public set description(value: string) {
    this._description = value;
  }

  /**
   * Setter timestamp
   * @param {string} value
   */
  public set timestamp(value: string) {
    this._timestamp = value;
  }
}
