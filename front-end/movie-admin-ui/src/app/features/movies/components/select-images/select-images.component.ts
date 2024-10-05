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

  loading: boolean = false;
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
      this.handleClearAll();
      let fileCount = files.length;
      for (let index = 0; index < fileCount; index++) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          const currentImage = new Image();
          const imageUrl = event.target.result;
          currentImage.src = imageUrl;
          currentImage.onload = () => {
            const type = currentImage.width >= currentImage.height ? 'horizontal' : 'vertical';
            this.images.push({ url: event.target.result, file: files[index], type });
            if (this.images.length === fileCount) {
              this.handleErrorImage();
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
    this.images.splice(index, 1);
    this.handleErrorImage();
    this.onChange(this.images);
  }

  handleClearAll() {
    this.images = [];
    this.errorMsg = '';
    this.onChange([]);
  }

  handleErrorImage() {
    if (this.images.filter((img) => img.type === 'horizontal').length < 2) {
      this.errorMsg = 'You need at least 2 horizontal images!';
      return;
    }

    if (this.images.filter((img) => img.type === 'vertical').length < 2) {
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
