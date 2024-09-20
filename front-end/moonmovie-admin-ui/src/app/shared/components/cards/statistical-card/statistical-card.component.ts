import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-statistical-card',
    standalone: true,
    imports: [CurrencyPipe],
    templateUrl: './statistical-card.component.html',
    styleUrl: './statistical-card.component.css',
})
export class StatisticalCardComponent {}
