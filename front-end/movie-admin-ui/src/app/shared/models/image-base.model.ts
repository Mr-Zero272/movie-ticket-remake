type ImageType = 'vertical' | 'horizontal' | 'square';

export class ImageBase {
  file: File | null;
  url: string;
  type: ImageType;
  needDelete: boolean;

  constructor(file: File | null, url: string, type: ImageType, needDelete: boolean) {
    this.file = file;
    this.url = url;
    this.type = type;
    this.needDelete = needDelete;
  }
}
