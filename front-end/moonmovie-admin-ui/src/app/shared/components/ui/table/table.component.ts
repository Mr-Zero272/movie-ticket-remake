import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
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
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { LabelAndValue } from '../../../models/labelAndValue';
import { Column, Sort } from '../../../models/table';
import { ButtonComponent } from '../button/button.component';
import { SortIconComponent } from '../sort-icon/sort-icon.component';

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
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
    @Input() columns: Array<Column> = []; // Array of column definitions
    @Input() data: any[] = [];
    @Input() sortData: Sort[] = [];
    @Input() headerTable!: TemplateRef<any>;

    @Output() onChoosePage = new EventEmitter<number>();
    @Output() onChooseSort = new EventEmitter<Sort>();
    activeSort: Sort = this.sortData[0];
    searchInput = new Subject<string>();
    searchValue: string = '';
    click = 0;

    constructor() {}

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
