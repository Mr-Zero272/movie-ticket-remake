import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { SelectImageItemComponent } from '../select-image-item/select-image-item.component';

@Component({
  selector: 'app-select-images',
  standalone: true,
  imports: [NgIf, NgFor, SelectImageItemComponent],
  templateUrl: './select-images.component.html',
  styleUrl: './select-images.component.css',
})
export class SelectImagesComponent {
  @ViewChild('inputImage') inputImageRef!: ElementRef<HTMLInputElement>;

  images: { file: File; url: string }[] = [];
  @Output() onChange = new EventEmitter<File[]>();

  constructor() {}

  handleChooseImages() {
    if (this.inputImageRef) {
      this.inputImageRef.nativeElement.click();
    }
  }

  handleFileInput(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      this.images = []; // Clear images to avoid duplication
      let fileCount = files.length; // Track the number of files
      for (let index = 0; index < fileCount; index++) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.images.push({ url: event.target.result, file: files[index] });

          // Check if all files are processed
          if (this.images.length === fileCount) {
            this.onChange.emit(this.images.map((image) => image.file));
          }
        };
        reader.readAsDataURL(files[index]);
      }
    }

    this.onChange.emit(this.images.map((image) => image.file));
  }

  handleDeleteImage(index: number) {
    this.images.splice(index, 1);
    this.onChange.emit(this.images.map((image) => image.file));
  }

  handleClearAll() {
    this.images = [];
    this.onChange.emit([]);
  }
}
