import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderStatisticalList } from '../../../shared/models/order-statistical.model';
import { BehaviorSubject, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const ORDER_API = 'http://localhost:8272/api/v2/moon-movie/reservation/order';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  getOrderStatistical(year: number = 2024) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.httpClient.get<OrderStatisticalList>(ORDER_API + '/statistical', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        year,
      },
    });
  }

  getBalance(year: number = 2024, data: OrderStatisticalList) {
    return data
      .filter((osl) => osl.year === year)[0]
      .orderStatisticalList.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.totalAmount;
      }, 0);
  }

  getPercentDifferenceBalance(year: number = 2024, data: OrderStatisticalList) {
    const thisYearListOrder = data.find((osl) => osl.year === year);
    const prevYearListOrder = data.find((osl) => osl.year === year - 1);

    if (thisYearListOrder && prevYearListOrder) {
      const totalThisYear = thisYearListOrder.orderStatisticalList.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalAmount,
        0,
      );
      const totalPrevYear = prevYearListOrder.orderStatisticalList.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalAmount,
        0,
      );

      if (totalThisYear > totalPrevYear) {
        return Math.round(100 - (totalThisYear * 100) / totalPrevYear);
      } else {
        return Math.round(100 - (totalPrevYear * 100) / totalThisYear);
      }
    }
    return 0;
  }
}
