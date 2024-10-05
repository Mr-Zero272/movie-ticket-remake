import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectImageItemComponent } from '../select-image-item/select-image-item.component';
import { ImageBase } from '../../../../shared/models/image-base.model';

@Component({
  selector: 'app-edit-images',
  standalone: true,
  imports: [SelectImageItemComponent, NgIf],
  templateUrl: './edit-images.component.html',
  styleUrl: './edit-images.component.scss',
})
export class EditImagesComponent implements OnInit {
  @Input() errorMsg: string = '';
  @Input() urls: string[] = [
    'https://i.pinimg.com/736x/78/f0/32/78f032a00f16d6714480dc1badfbbb18.jpg',
    'https://i.pinimg.com/564x/0b/83/67/0b8367ede19d9a16f6a14157da8228e5.jpg',
    'https://i.pinimg.com/1200x/cf/fb/2e/cffb2ebcc1dbde6cbbf79ed7cbaeddef.jpg',
    'https://i.pinimg.com/1200x/2b/11/ca/2b11cada54d1f723dee3b92893143b0c.jpg',
  ];

  @Output() onChange = new EventEmitter<Array<ImageBase>>();

  loading: boolean = false;
  images: Array<ImageBase> = [];
  needDeleteImage: Array<ImageBase> = [];

  constructor() {}

  ngOnInit(): void {
    this.urls.map((url) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        let type: 'vertical' | 'horizontal' | 'square' = 'square';
        type = image.width >= image.height ? 'horizontal' : 'vertical';
        this.images.push(new ImageBase(null, url, type, false));
        if (this.images.length === this.urls.length) {
          this.sortImages();
        }
      };
    });
  }

  sortImages() {
    this.images.sort((a, b) => {
      if (a.type === 'vertical') {
        return -1;
      } else if (b.type === 'vertical') {
        return 1;
      } else {
        return 0;
      }
    });
  }

  isClearAll() {
    if (this.images.length === 0) {
      return true;
    } else if (this.images.length !== 0 && !this.images.some((img) => img.needDelete === false)) {
      return true;
    }
    return false;
  }

  handleFileInput(e: Event) {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      // this.handleClearAll();
      let fileCount = files.length;
      let totalFileAdded = 0;
      for (let index = 0; index < fileCount; index++) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          const currentImage = new Image();
          const imageUrl = event.target.result;
          currentImage.src = imageUrl;
          currentImage.onload = () => {
            const type = currentImage.width >= currentImage.height ? 'horizontal' : 'vertical';
            this.images.push({ url: event.target.result, file: files[index], type, needDelete: false });
            totalFileAdded++;
            if (totalFileAdded === fileCount) {
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
              this.onChange.emit(this.images.concat(this.needDeleteImage));
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
    if (this.images[index].file === null) {
      this.images[index].needDelete = true;
      this.needDeleteImage.push(this.images[index]);
    }
    this.images.splice(index, 1);

    this.handleErrorImage();
    this.onChange.emit(this.images.concat(this.needDeleteImage));
  }

  handleClearAll() {
    this.images = [];
    this.errorMsg = '';
    this.onChange.emit(this.images.concat(this.needDeleteImage));
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
}
