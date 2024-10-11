export type OrderStatisticalList = OrderYearStatistical[];

export interface OrderYearStatistical {
  year: number;
  orderStatisticalList: OrderStatistical[];
}

export interface OrderStatistical {
  totalAmount: number;
  totalServiceFee: number;
  totalOrders: number;
  month: number;
}
