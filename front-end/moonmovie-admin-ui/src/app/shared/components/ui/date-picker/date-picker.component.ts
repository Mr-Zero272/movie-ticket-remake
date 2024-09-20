import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UtilsService } from '../../../../core/services/utils.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [NgFor, NgIf, NgClass, DatePipe],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.css',
})
export class DatePickerComponent {
    @Input() class: string = '';
    @Input() initialDate: string = new Date().toISOString().split('T')[0];
    @Output() onChooseDate = new EventEmitter<string>();

    activeDate: string = this.initialDate + 'T00:00:00';
    listDate: string[] = [];

    // drag event
    isMouseDown: boolean = false;
    startX: number = 0;
    scrollLeft: number = 0;
    moveDistance: number = 0;
    @ViewChild('datePickerRef') datePickerRef!: ElementRef<HTMLDivElement>;

    constructor(private utilsService: UtilsService) {
        this.listDate = utilsService.generateDateRangeNext(this.initialDate, 100);
    }

    handleDateClick(date: string) {
        if (this.moveDistance < 5) {
            this.onChooseDate.emit(date);
            this.activeDate = date;
        }
    }

    handleClickNextDate() {
        if (this.datePickerRef !== null) {
            this.datePickerRef.nativeElement.scrollBy({ left: +145, behavior: 'smooth' });
        }
    }

    handleClickPrevDate() {
        if (this.datePickerRef !== null) {
            this.datePickerRef.nativeElement.scrollBy({ left: -145, behavior: 'smooth' });
        }
    }

    handleMouseDown(e: Event) {
        this.isMouseDown = true;
        if (this.datePickerRef !== null) {
            this.startX = (e as MouseEvent).pageX - this.datePickerRef.nativeElement.offsetLeft;
            this.scrollLeft = this.datePickerRef.nativeElement.scrollLeft;
        }
        this.moveDistance = 0;
    }

    handleMouseLeave() {
        this.isMouseDown = false;
    }

    handleMouseUp() {
        this.isMouseDown = false;
    }

    handleMouseMove(e: Event) {
        if (!this.isMouseDown) return;
        e.preventDefault();
        if (this.datePickerRef !== null) {
            const x = (e as MouseEvent).pageX - this.datePickerRef.nativeElement.offsetLeft;
            const walk = (x - this.startX) * 1;
            this.datePickerRef.nativeElement.scrollLeft = this.scrollLeft - walk;
            this.moveDistance += Math.abs(walk);
        }
    }
}
