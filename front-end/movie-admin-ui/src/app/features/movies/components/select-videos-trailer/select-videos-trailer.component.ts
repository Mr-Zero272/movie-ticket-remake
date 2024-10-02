import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-videos-trailer',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './select-videos-trailer.component.html',
  styleUrl: './select-videos-trailer.component.scss',
})
export class SelectVideosTrailerComponent {
  @Input() class: string = '';
  @Input() urlVideo: string | undefined = '';

  @Output() onChooseVideo = new EventEmitter<void>();
  @Output() onDeleteVideo = new EventEmitter<void>();

  constructor() {
    console.log(this.urlVideo);
  }

  handleChooseVideo() {
    this.onChooseVideo.emit();
  }

  handleDeleteVideo() {
    this.onDeleteVideo.emit();
  }
}
