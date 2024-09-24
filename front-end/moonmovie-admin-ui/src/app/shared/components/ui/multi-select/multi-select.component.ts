import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { NgFor, NgIf } from '@angular/common';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-multi-select',
    standalone: true,
    imports: [OutsideClickDirective, NgIf, DropdownMenuItemComponent, FormsModule, NgFor],
    templateUrl: './multi-select.component.html',
    styleUrl: './multi-select.component.css',
})
export class MultiSelectComponent implements OnInit {
    @Input() data: { key: string; value: string | number }[] = [];
    @Output() onChangeItem = new EventEmitter<{ key: string; value: string | number }[]>();

    selectedResults: { key: string; value: string | number }[] = [];
    searchResults: { key: string; value: string | number }[] = [];
    searchValue: string = '';
    isSearchResultsOpen: boolean = false;

    ngOnInit(): void {
        this.searchResults = this.data;
    }

    handleSearchValue(value: string) {
        this.searchValue = value;

        this.searchResults =
            this.searchValue === ''
                ? this.data
                : this.data.filter((item) => item.key.toLowerCase().includes(this.searchValue.toLowerCase()));
    }

    chooseItem(item: { key: string; value: string | number }) {
        this.selectedResults.push(item);
        this.data = this.data.filter((it) => it.value !== item.value);
        this.isSearchResultsOpen = false;
        this.searchResults = this.data;
        this.searchValue = '';
        this.onChangeItem.emit(this.selectedResults);
    }

    deleteItem(item: { key: string; value: string | number }) {
        this.selectedResults = this.selectedResults.filter((it) => it.value !== item.value);
        this.data.push(item);
        this.onChangeItem.emit(this.selectedResults);
    }

    toggleSearchResult(isOpen: boolean) {
        this.isSearchResultsOpen = isOpen;
    }
}
