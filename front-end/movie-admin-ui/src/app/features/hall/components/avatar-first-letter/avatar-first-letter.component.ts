import { Component, Input } from '@angular/core';
import { FirstLetterPipe } from '../../../../shared/pipes/first-letter.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-avatar-first-letter',
  standalone: true,
  imports: [FirstLetterPipe, NgClass],
  templateUrl: './avatar-first-letter.component.html',
  styleUrl: './avatar-first-letter.component.scss',
})
export class AvatarFirstLetterComponent {
  @Input() name: string = 'a';
  @Input() backgroundColor: 'blue' | 'green' | 'indigo' | 'purple' | 'orange' | 'yellow' | 'red' = 'green';
}
