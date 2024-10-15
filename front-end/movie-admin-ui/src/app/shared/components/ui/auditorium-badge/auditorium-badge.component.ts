import { NgClass, NgIf } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-auditorium-badge',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './auditorium-badge.component.html',
  styleUrl: './auditorium-badge.component.css',
})
export class AuditoriumBadgeComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() colorIndex: number = 0;
  @Input() hall: string = '';
  @Input() subInfo: string = '';
  @Input() active: boolean = false;
  @Input() class: string = '';
  @Input() randomColor: boolean = true;
  @Output() chooseAuditorium = new EventEmitter<void>();

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

  handleChooseAuditorium() {
    this.chooseAuditorium.emit();
  }
}
