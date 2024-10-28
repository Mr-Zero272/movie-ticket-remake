import { Location, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-back-btn',
  standalone: true,
  imports: [NgClass, MatTooltip],
  templateUrl: './back-btn.component.html',
  styleUrl: './back-btn.component.scss',
})
export class BackBtnComponent {
  @Input() class: string = '';
  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
}
