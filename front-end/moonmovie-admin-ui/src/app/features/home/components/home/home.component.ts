import { Component } from '@angular/core';
import { StatisticalCardComponent } from '../../../../shared/components/cards/statistical-card/statistical-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [StatisticalCardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {}
