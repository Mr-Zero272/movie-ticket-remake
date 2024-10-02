import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-select-image-item',
    standalone: true,
    imports: [NgIf, NgClass],
    templateUrl: './select-image-item.component.html',
    styleUrl: './select-image-item.component.css',
})
export class SelectImageItemComponent {
    @Input() class: string = '';
    @Input() urlImage: string | undefined = '';

    @Output() onChooseImage = new EventEmitter<void>();
    @Output() onDeleteImage = new EventEmitter<void>();

    handleChooseImage() {
        this.onChooseImage.emit();
    }

    handleDeleteImage() {
        this.onDeleteImage.emit();
    }
}
