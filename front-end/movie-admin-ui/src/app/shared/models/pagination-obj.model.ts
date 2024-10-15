export class Pagination<T> {
  data: Array<T>;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;

  constructor(data: Array<T>, page: number, size: number, totalPages: number, totalElements: number) {
    this.data = data;
    this.page = page;
    this.size = size;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
  }
}
