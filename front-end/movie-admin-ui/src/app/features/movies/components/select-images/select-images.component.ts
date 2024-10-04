import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SelectImageItemComponent } from '../select-image-item/select-image-item.component';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../../../shared/directives/control-value-accessor.directive';

@Component({
  selector: 'app-select-images',
  standalone: true,
  imports: [NgIf, NgFor, SelectImageItemComponent, ReactiveFormsModule],
  templateUrl: './select-images.component.html',
  styleUrl: './select-images.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectImagesComponent),
      multi: true,
    },
  ],
})
export class SelectImagesComponent implements ControlValueAccessor {
  @Input() errorMsg: string = '';

  onChange = (videos: Array<{ file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }>) => {};

  @ViewChild('inputImage') inputImageRef!: ElementRef<HTMLInputElement>;

  loading: boolean = true;
  totalVerticalImages: number = 0;
  totalHorizontalImages: number = 0;
  images: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }[] = [];

  handleChooseImages() {
    if (this.inputImageRef) {
      this.inputImageRef.nativeElement.click();
    }
  }

  handleFileInput(e: Event) {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      this.images = []; // Clear images to avoid duplication
      let fileCount = files.length; // Track the number of files
      for (let index = 0; index < fileCount; index++) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          const currentImage = new Image();
          const imageUrl = event.target.result;
          currentImage.src = imageUrl;
          currentImage.onload = () => {
            const type = currentImage.width >= currentImage.height ? 'horizontal' : 'vertical';
            if (type === 'horizontal') {
              this.totalHorizontalImages++;
            } else {
              this.totalVerticalImages++;
            }
            this.handleErrorImage();
            this.images.push({ url: event.target.result, file: files[index], type });
            if (this.images.length === fileCount) {
              // sort for two vertical image come first
              this.images.sort((a, b) => {
                if (a.type === 'vertical') {
                  return -1;
                } else if (b.type === 'vertical') {
                  return 1;
                } else {
                  return 0;
                }
              });

              this.onChange(this.images);
              this.loading = false;
            }
          };
        };
        this.loading = true;
        reader.readAsDataURL(files[index]);
      }
    }
  }

  handleDeleteImage(index: number) {
    if (this.images[index].type === 'horizontal') {
      this.totalHorizontalImages--;
    } else {
      this.totalVerticalImages--;
    }
    this.handleErrorImage();
    this.images.splice(index, 1);
    this.onChange(this.images);
  }

  handleClearAll() {
    this.images = [];
    this.errorMsg = '';
    this.onChange([]);
  }

  handleErrorImage() {
    if (this.totalHorizontalImages < 2) {
      this.errorMsg = 'You need at least 2 horizontal images!';
      return;
    }

    if (this.totalVerticalImages < 2) {
      this.errorMsg = 'You need at least 2 vertical images!';
      return;
    }
    this.errorMsg = '';
  }

  // Methods for ControlValueAccessor

  onTouched = () => {};

  writeValue(images: Array<{ file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }>): void {
    this.images = images || [];
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  // Method to reset the component
  reset(): void {
    this.images = [];
  }
}
