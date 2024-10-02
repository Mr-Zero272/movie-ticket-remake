import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Column, Sort } from '../../../../shared/models/table';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { Order } from '../../../../shared/models/order.model';
import { OrdersService } from '../../services/orders.service';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { LabelAndValue } from '../../../../shared/models/labelAndValue';
import { TabsComponent } from '../../../../shared/components/ui/tabs/tabs.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableComponent, TabsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements AfterViewInit, OnInit {
  columns: Array<Column> = [];
  ordersData!: Pagination<Order>;
  loading: boolean = false;
  tabsData: LabelAndValue[] = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Complete',
      value: 'complete',
    },
    {
      label: 'Pending',
      value: 'pending',
    },
  ];
  activeTab: LabelAndValue = this.tabsData[0];
  sortData: Array<Sort> = [
    {
      label: 'Amount',
      key: 'amount',
      order: 'asc',
    },
    {
      label: 'Service fee',
      key: 'serviceFee',
      order: 'asc',
    },
    {
      label: 'Customer id',
      key: 'customerId',
      order: 'asc',
    },
    {
      label: 'Order status',
      key: 'orderStatus',
      order: 'asc',
    },
    {
      label: 'Timestamp',
      key: 'timestamp',
      order: 'asc',
    },
  ];
  activeSort: Sort = this.sortData[0];

  constructor(
    private cdr: ChangeDetectorRef,
    private ordersService: OrdersService,
  ) {}

  ngOnInit(): void {
    this.handleFetchOrders({});
  }

  ngAfterViewInit(): void {
    this.columns = [
      { label: 'Amount', key: 'amount' },
      { label: 'Service fee', key: 'serviceFee' },
      { label: 'Customer id', key: 'customerId' },
      { label: 'Order status', key: 'orderStatus' },
      { label: 'Timestamp', key: 'timestamp' },
    ];
    this.cdr.detectChanges();
  }

  handleFetchOrders({
    page = 1,
    size = 7,
  }: {
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.ordersService
      .fetchOrders({
        page,
        size,
        sort: this.activeSort.key,
        sortOrder: this.activeSort.order,
        orderStatus: this.activeTab.value as string,
      })
      .subscribe((data) => {
        this.ordersData = data;
      }).closed;
    this.loading = false;
  }

  handleChangePage(page: number) {
    this.handleFetchOrders({
      page: page,
    });
  }

  handleChangeSort(sort: Sort) {
    this.activeSort = sort;
    this.handleFetchOrders({});
  }

  handleChooseTab(tab: LabelAndValue) {
    this.activeTab = tab;
    this.handleFetchOrders({});
  }
}
