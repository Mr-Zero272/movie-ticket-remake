import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-trailer',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './edit-trailer.component.html',
  styleUrl: './edit-trailer.component.scss',
})
export class EditTrailerComponent implements OnInit {
  @Input() errorMsg: string = '';
  @Input() class: string = '';
  @Input() urlTrailer: string = 'http://localhost:8272/api/v2/moon-movie/media/videos/42QN1U2NEZMn2zDElEgFCO5yp36v.mp4';

  @Output() onChange = new EventEmitter<{ url: string; file: File } | null>();

  loading: boolean = false;
  trailer: { url: string; file: File | null } | null = null;

  ngOnInit(): void {
    this.trailer = {
      url: this.urlTrailer,
      file: null,
    };
  }

  handleDeleteVideo() {
    this.trailer = null;
    this.onChange.emit(null);
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
        this.onChange.emit({ url: event.target.result, file: files[0] });
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
}
