import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Order } from '../../../shared/models/order.model';
import { Ticket } from '../../../shared/models/ticket.model';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/reservation';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  fetchOrders({
    orderStatus = 'complete',
    page = 1,
    size = 7,
    sort = 'name',
    sortOrder = 'asc',
  }: {
    orderStatus?: string;
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http.get<Pagination<Order>>(`${API_URL}/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        size,
        sort,
        sortOrder,
        orderStatus,
      },
    });
  }

  fetchTicketsByOrderId(orderId: string) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http.get<Array<Ticket>>(`${API_URL}/ticket/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  fetchOrderInfo(orderId: string) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http.get<Order>(`${API_URL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
