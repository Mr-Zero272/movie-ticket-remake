import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle } from '@ng-icons/heroicons/outline';
import { Order } from '../../../models/order.model';
import { MarqueeTextComponent } from '../marquee-text/marquee-text.component';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [NgIconComponent, CurrencyPipe, MarqueeTextComponent],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  viewProviders: [
    provideIcons({
      heroPlusCircle,
    }),
  ],
})
export class OrderItemComponent {
  @Input({ required: true }) order!: Order;
}
