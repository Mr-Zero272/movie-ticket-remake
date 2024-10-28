import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { OrdersService } from '../../services/orders.service';

import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../shared/models/order.model';
import { Ticket } from '../../../../shared/models/ticket.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { TicketComponent } from '../../../../shared/components/ui/ticket/ticket.component';
import { User } from '../../../../shared/models/auth.model';
import { UserService } from '../../../../shared/services/user.service';
import { BackBtnComponent } from '../../../../shared/components/ui/back-btn/back-btn.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TicketComponent, NgClass, BackBtnComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  userInfo: User | null = null;
  orderId: string = '';
  orderDetail: Order | null = null;
  tickets: Array<Ticket> = [];

  constructor(
    private authService: AuthService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('id');
      if (orderId) {
        this.orderId = orderId;
        this.orderService.fetchOrderInfo(orderId).subscribe((orderInfo) => {
          this.orderDetail = orderInfo;
          this.userService.fetchUserInfo(orderInfo.customerId).subscribe((user) => {
            this.userInfo = user;
          });
        });
        this.orderService.fetchTicketsByOrderId(orderId).subscribe((tickets) => {
          this.tickets = tickets;
        });
      }
    });
  }
}
