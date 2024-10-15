import { Component, Input, OnInit } from '@angular/core';
import { FirstLetterPipe } from '../../../../shared/pipes/first-letter.pipe';
import { NgClass, NgIf } from '@angular/common';
import { UtilsService } from '../../../../shared/services/utils.service';

type BackgroundType = 'blue' | 'green' | 'indigo' | 'purple' | 'orange' | 'yellow' | 'red' | 'default';
@Component({
  selector: 'app-avatar-first-letter',
  standalone: true,
  imports: [FirstLetterPipe, NgClass, NgIf],
  templateUrl: './avatar-first-letter.component.html',
  styleUrl: './avatar-first-letter.component.scss',
})
export class AvatarFirstLetterComponent implements OnInit {
  @Input() name: string = 'a';
  @Input() backgroundColor: BackgroundType = 'default';
  @Input() randomBackground: boolean = false;
  @Input() loading: boolean = false;

  backgrounds: string[] = ['blue', 'green', 'indigo', 'purple', 'orange', 'yellow', 'red', 'default'];

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.getBackground();
  }

  getBackground() {
    if (!this.randomBackground) return;

    let randomNumber = this.utilsService.getRandomNumber(0, 7);
    if (randomNumber < 0) randomNumber = 0;
    if (randomNumber > 7) randomNumber = 7;
    this.backgroundColor = this.backgrounds[randomNumber] as BackgroundType;
  }
}
