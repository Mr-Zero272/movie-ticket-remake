import { CurrencyPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-statistical-card',
  standalone: true,
  imports: [CurrencyPipe, NgTemplateOutlet, NgIf],
  templateUrl: './statistical-card.component.html',
  styleUrl: './statistical-card.component.css',
})
export class StatisticalCardComponent {
  @Input() describe: string = '';
  @Input() valueType: 'currency' | 'normal' = 'normal';
  @Input() value: string | number = 'normal value';

  @Input() icon!: TemplateRef<any>;
}
