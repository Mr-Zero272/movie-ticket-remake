import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginationService } from '../../../../core/services/pagination.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() page: number = 1;
  @Input() totalPages: number = 10;
  @Input() size: number = 7;
  @Input() totalElements: number = 7;
  @Input() loading: boolean = false;
  @Output() nextPage = new EventEmitter<number>();
  @Output() prevPage = new EventEmitter<number>();
  @Output() choosePage = new EventEmitter<number>();

  current: number = 0;
  prev: number | null = null;
  next: number | null = null;
  items: (string | number)[] = [];
  constructor(private paginationService: PaginationService) {}

  ngOnInit(): void {
    this.updatePaginationState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePaginationState();
  }

  updatePaginationState() {
    const { current, prev, next, items } = this.paginationService.paginate({
      current: this.page,
      max: this.totalPages,
    });
    this.current = current;
    this.prev = prev;
    this.next = next;
    this.items = items;
  }

  isThreeDots(item: any): boolean {
    return typeof item === 'string';
  }

  handleNextPage() {
    if (this.next !== null) {
      this.nextPage.emit(this.next);
    }
  }

  handlePrevPage() {
    if (this.prev !== null) {
      this.prevPage.emit(this.prev);
    }
  }

  handleChoosePage(page: number) {
    this.choosePage.emit(page);
  }
}
