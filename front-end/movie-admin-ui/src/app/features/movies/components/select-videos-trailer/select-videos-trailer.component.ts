import { NgClass, NgIf } from '@angular/common';
import { Component, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-videos-trailer',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './select-videos-trailer.component.html',
  styleUrl: './select-videos-trailer.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectVideosTrailerComponent),
      multi: true,
    },
  ],
})
export class SelectVideosTrailerComponent implements ControlValueAccessor {
  @Input() errorMsg: string = '';
  @Input() class: string = '';

  loading: boolean = false;
  trailer: { url: string; file: File } | null = null;

  handleDeleteVideo() {
    this.trailer = null;
    this.handleErrorTrailer();
  }

  handleChangeVideo(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length !== 0) {
      this.trailer = null;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.trailer = {
          url: event.target.result,
          file: files[0],
        };
        this.handleErrorTrailer();
        this.onChange({ url: event.target.result, file: files[0] });
        this.loading = false;
      };
      this.loading = true;
      reader.readAsDataURL(files[0]);
    }
  }

  handleErrorTrailer() {
    if (this.trailer === null) {
      this.errorMsg = 'This field is required.';
      return;
    }
    this.errorMsg = '';
  }

  onChange(trailer: { url: string; file: File }) {}
  onTouched = () => {};

  writeValue(trailer: { url: string; file: File } | null): void {
    this.trailer = trailer;
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
    this.trailer = null;
  }
}
