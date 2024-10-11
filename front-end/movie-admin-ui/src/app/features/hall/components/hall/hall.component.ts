import { Component } from '@angular/core';
import { AvatarFirstLetterComponent } from '../avatar-first-letter/avatar-first-letter.component';

@Component({
  selector: 'app-hall',
  standalone: true,
  imports: [AvatarFirstLetterComponent],
  templateUrl: './hall.component.html',
  styleUrl: './hall.component.scss',
})
export class HallComponent {}
