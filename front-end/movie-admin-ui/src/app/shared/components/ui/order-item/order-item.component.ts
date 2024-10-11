import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle } from '@ng-icons/heroicons/outline';
import { Order } from '../../../models/order.model';
import { MarqueeTextComponent } from '../marquee-text/marquee-text.component';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [NgIf, NgIconComponent, CurrencyPipe, MarqueeTextComponent],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  viewProviders: [
    provideIcons({
      heroPlusCircle,
    }),
  ],
})
export class OrderItemComponent {
  @Input() loading: boolean = false;
  @Input() title: string = 'Title';
  @Input() describe: string = '';
  @Input() valueType: 'currency' | 'normal' = 'currency';
  @Input() value: string | number = 0;
}
