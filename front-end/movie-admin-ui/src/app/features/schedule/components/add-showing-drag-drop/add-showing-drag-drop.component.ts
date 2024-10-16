import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ShowingBadgeComponent } from '../showing-badge/showing-badge.component';
import { Showing } from '../../../../shared/models/showing.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { UtilsService } from '../../../../shared/services/utils.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-add-showing-drag-drop',
  standalone: true,
  imports: [NgIf, NgFor, ShowingBadgeComponent, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './add-showing-drag-drop.component.html',
  styleUrl: './add-showing-drag-drop.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddShowingDragDropComponent),
      multi: true,
    },
  ],
})
export class AddShowingDragDropComponent implements ControlValueAccessor {
  @Input() listShowings: Array<Showing> = [];
  @Input() showingAdding: Showing | null = null;
  @Input() auditoriumName: string = '';
  position: number = 0;

  constructor(private utilsService: UtilsService) {}

  drop(event: CdkDragDrop<Showing[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.reCalculateStarTime(event.container.data);
    const position = this.getPositionInList(event.container.data);
    this.position = position;
    this.onChange(position);
  }

  reCalculateStarTime(data1: Array<Showing>) {
    if (this.showingAdding) {
      const length = data1.length;
      let startTime = this.showingAdding.startTime.split('T')[0] + 'T06:00:00';
      for (let i = 0; i < length; i++) {
        data1[i].startTime = startTime;
        startTime = this.utilsService.addMinutesToDateTime(startTime, data1[i].movie.runtime + 20);
      }
    }
  }

  getPositionInList(data: Array<Showing>) {
    if (this.showingAdding) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === this.showingAdding.id) {
          return i + 1;
        }
      }
    }

    return 0;
  }

  onChange(position: number) {}
  onTouched = () => {};

  writeValue(position: number): void {
    this.position = position;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  reset(): void {
    this.position = 0;
  }
}
