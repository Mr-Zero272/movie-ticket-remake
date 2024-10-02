import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [NgIconComponent, CurrencyPipe],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  viewProviders: [
    provideIcons({
      heroPlusCircle,
    }),
  ],
})
export class OrderItemComponent {}
