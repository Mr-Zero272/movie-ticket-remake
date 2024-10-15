import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MarqueeTextComponent } from '../../../../shared/components/ui/marquee-text/marquee-text.component';
import { UtilsService } from '../../../../shared/services/utils.service';

@Component({
  selector: 'app-showing-badge',
  standalone: true,
  imports: [DatePipe, MarqueeTextComponent, NgIf, NgClass],
  templateUrl: './showing-badge.component.html',
  styleUrl: './showing-badge.component.css',
})
export class ShowingBadgeComponent implements OnInit {
  @Input() index = 1;
  @Input() colorIndex: number = 0;
  @Input() loading: boolean = false;
  @Input() title: string = 'Hello world';
  @Input() time: string = '2024-09-22T00:00:00';
  @Input() active: boolean = false;
  @Input() randomColor: boolean = true;

  constructor(private utilsService: UtilsService) {}

  listColors: string[] = [
    'rgb(239 68 68)',
    'rgb(249 115 22)',
    'rgb(245 158 11)',
    'rgb(132 204 22)',
    'rgb(34 197 94)',
    'rgb(20 184 166)',
    'rgb(6 182 212)',
    'rgb(99 102 241)',
    'rgb(244 63 94)',
    'rgb(236 72 153)',
  ];
  backgroundColor: string = 'rgb(239 68 68)';

  ngOnInit(): void {
    let randomIndex = 0;
    if (this.randomColor) {
      randomIndex = this.utilsService.getRandomNumber(0, this.listColors.length - 1);
    } else {
      randomIndex = this.colorIndex > 9 ? 0 : this.colorIndex;
    }
    this.backgroundColor = this.listColors[randomIndex];
  }
}
