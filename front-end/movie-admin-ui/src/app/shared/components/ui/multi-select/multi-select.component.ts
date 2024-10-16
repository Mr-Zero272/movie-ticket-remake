import { NgFor, NgIf } from '@angular/common';
import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [OutsideClickDirective, NgIf, DropdownMenuItemComponent, FormsModule, NgFor],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() isFormReset: boolean = false;
  @Input() data: { key: string; value: string | number }[] = [];

  selectedResults: { key: string; value: string | number }[] = [];
  searchResults: { key: string; value: string | number }[] = [];
  searchValue: string = '';
  isSearchResultsOpen: boolean = false;

  ngOnInit(): void {
    this.searchResults = this.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFormReset) {
      this.searchResults = [];
      this.onChange([]);
    }
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
    this.onChange(this.selectedResults);
  }

  deleteItem(item: { key: string; value: string | number }) {
    this.selectedResults = this.selectedResults.filter((it) => it.value !== item.value);
    this.data.push(item);
    this.onChange(this.selectedResults);
  }

  toggleSearchResult(isOpen: boolean) {
    this.isSearchResultsOpen = isOpen;
  }

  onChange(genres: { key: string; value: string | number }[]) {}
  onTouched = () => {};

  writeValue(genres: { key: string; value: string | number }[]): void {
    this.selectedResults = genres;
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
    this.selectedResults = [];
  }
}
