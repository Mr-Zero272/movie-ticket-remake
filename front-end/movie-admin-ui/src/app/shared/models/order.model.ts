import { Payment } from './payment.model';

export class Order {
  private _id: string;
  private _amount: number;
  private _serviceFee: number;
  private _customerId: string;
  private _orderStatus: string;
  private _timestamp: string;
  private _payments: Array<Payment>;

  constructor(
    id: string,
    amount: number,
    serviceFee: number,
    customerId: string,
    orderStatus: string,
    timestamp: string,
    payments: Array<Payment>,
  ) {
    this._id = id;
    this._amount = amount;
    this._serviceFee = serviceFee;
    this._customerId = customerId;
    this._orderStatus = orderStatus;
    this._timestamp = timestamp;
    this._payments = payments;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter amount
   * @return {number}
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Getter serviceFee
   * @return {number}
   */
  public get serviceFee(): number {
    return this._serviceFee;
  }

  /**
   * Getter customerId
   * @return {string}
   */
  public get customerId(): string {
    return this._customerId;
  }

  /**
   * Getter orderStatus
   * @return {string}
   */
  public get orderStatus(): string {
    return this._orderStatus;
  }

  /**
   * Getter timestamp
   * @return {string}
   */
  public get timestamp(): string {
    return this._timestamp;
  }

  /**
   * Getter payments
   * @return {Array<Payment>}
   */
  public get payments(): Array<Payment> {
    return this._payments;
  }

  /**
   * Setter id
   * @param {string} value
   */
  public set id(value: string) {
    this._id = value;
  }

  /**
   * Setter amount
   * @param {number} value
   */
  public set amount(value: number) {
    this._amount = value;
  }

  /**
   * Setter serviceFee
   * @param {number} value
   */
  public set serviceFee(value: number) {
    this._serviceFee = value;
  }

  /**
   * Setter customerId
   * @param {string} value
   */
  public set customerId(value: string) {
    this._customerId = value;
  }

  /**
   * Setter orderStatus
   * @param {string} value
   */
  public set orderStatus(value: string) {
    this._orderStatus = value;
  }

  /**
   * Setter timestamp
   * @param {string} value
   */
  public set timestamp(value: string) {
    this._timestamp = value;
  }

  /**
   * Setter payments
   * @param {Array<Payment>} value
   */
  public set payments(value: Array<Payment>) {
    this._payments = value;
  }
}
