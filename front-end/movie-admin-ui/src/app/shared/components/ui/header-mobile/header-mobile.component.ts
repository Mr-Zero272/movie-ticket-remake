import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-mobile',
  standalone: true,
  imports: [],
  templateUrl: './header-mobile.component.html',
  styleUrl: './header-mobile.component.scss',
})
export class HeaderMobileComponent {
  @Input() title: string = 'Title';

  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
}
