import { Component, forwardRef, OnInit } from '@angular/core';
import { AuditoriumBadgeComponent } from '../auditorium-badge/auditorium-badge.component';
import { NgFor, NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Hall } from '../../../models/hall.model';
import { HallService } from '../../../../features/hall/services/hall.service';

@Component({
  selector: 'app-select-auditorium',
  standalone: true,
  imports: [AuditoriumBadgeComponent, NgIf, NgFor],
  templateUrl: './select-auditorium.component.html',
  styleUrl: './select-auditorium.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAuditoriumComponent),
      multi: true,
    },
  ],
})
export class SelectAuditoriumComponent implements ControlValueAccessor, OnInit {
  halls: Array<Hall> = [];
  auditorium: Hall | null = null;

  constructor(private hallService: HallService) {}

  ngOnInit(): void {
    this.hallService.fetchHalls({ size: 10 }).subscribe((data) => {
      this.halls = data.data;
    });
  }

  handleChooseHall(hall: Hall) {
    this.auditorium = hall;
    this.onChange(hall);
  }

  onChange(auditorium: Hall) {}
  onTouched = () => {};

  writeValue(auditorium: Hall): void {
    this.auditorium = auditorium;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  reset(): void {
    this.auditorium = null;
  }
}
