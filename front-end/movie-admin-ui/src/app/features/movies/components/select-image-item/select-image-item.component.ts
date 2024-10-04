import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-image-item',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './select-image-item.component.html',
  styleUrl: './select-image-item.component.css',
})
export class SelectImageItemComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() class: string = '';
  @Input() urlImage: string | undefined = '';

  @Output() onChooseImage = new EventEmitter<void>();
  @Output() onDeleteImage = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.urlImage === undefined) {
      this.loading = false;
    }
  }

  handleChooseImage() {
    this.onChooseImage.emit();
  }

  handleDeleteImage() {
    this.onDeleteImage.emit();
  }
}
