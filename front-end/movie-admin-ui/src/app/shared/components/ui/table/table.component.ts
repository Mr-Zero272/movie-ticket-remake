import {
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { Column, Sort } from '../../../models/table';
import { ButtonComponent } from '../button/button.component';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortIconComponent } from '../sort-icon/sort-icon.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    PaginationComponent,
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DatePipe,
    DropdownMenuComponent,
    DropdownMenuItemComponent,
    FormsModule,
    NgTemplateOutlet,
    ButtonComponent,
    SortIconComponent,
    NgIconComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  viewProviders: [
    provideIcons({
      heroXCircle,
    }),
  ],
})
export class TableComponent implements OnInit {
  @Input() columns: Array<Column> = []; // Array of column definitions
  @Input() tableData!: any;
  @Input() sortData: Sort[] = [];
  @Input() headerTable!: TemplateRef<any>;
  @Input() lastColumn!: TemplateRef<any>;
  @Input() loading: boolean = false;
  @Input() haveSearch: boolean = true;
  @Input() haveLastColumn: boolean = true;

  @Output() onChoosePage = new EventEmitter<number>();
  @Output() onChooseSort = new EventEmitter<Sort>();
  @Output() onSearch = new EventEmitter<string>();

  activeSort: Sort = this.sortData[0];
  searchInput = new Subject<string>();
  searchValue: string = '';
  click = 0;

  constructor() {
    this.searchInput.pipe(debounceTime(500)).subscribe((searchTerm: string) => {
      // Call your search function here
      this.onSearch.emit(searchTerm);
    });
  }

  ngOnInit(): void {
    this.activeSort = this.sortData[0];
  }

  onSearchInputChange(event: Event) {
    this.searchInput.next((event.target as HTMLInputElement).value);
  }

  handleChangeSort(newSort: Sort) {
    if (this.activeSort.key === newSort.key) {
      const nSort: Sort = { ...this.activeSort, order: this.activeSort.order === 'asc' ? 'desc' : 'asc' };
      this.activeSort = nSort;
      this.onChooseSort.emit(nSort);
    } else {
      this.activeSort = newSort;
      this.onChooseSort.emit(newSort);
    }
  }

  handleChoosePage(page: number) {
    this.onChoosePage.emit(page);
  }
}
