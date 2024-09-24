import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { UtilsService } from '../../../../core/services/utils.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [NgFor, NgIf, NgClass, DatePipe],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.css',
})
export class DatePickerComponent implements AfterViewInit {
    @Input() class: string = '';
    @Input() month: number = 0;
    @Input() initialDate: string = new Date().toISOString().split('T')[0];
    @Output() onChooseDate = new EventEmitter<string>();
    @Output() onChooseMonth = new EventEmitter<number>();

    listMonths: { month: number; label: string }[] = [
        {
            month: 1,
            label: 'January',
        },
        {
            month: 2,
            label: 'February',
        },
        {
            month: 3,
            label: 'March',
        },
        {
            month: 4,
            label: 'April',
        },
        {
            month: 5,
            label: 'May',
        },
        {
            month: 6,
            label: 'June',
        },
        {
            month: 7,
            label: 'July',
        },
        {
            month: 8,
            label: 'August',
        },
        {
            month: 9,
            label: 'September',
        },
        {
            month: 10,
            label: 'October',
        },
        {
            month: 11,
            label: 'November',
        },
        {
            month: 12,
            label: 'December',
        },
    ];

    activeDate: string = this.initialDate + 'T00:00:00';
    listDate: string[] = [];

    // drag event
    isMouseDown: boolean = false;
    startX: number = 0;
    scrollLeft: number = 0;
    moveDistance: number = 0;
    @ViewChild('datePickerRef') datePickerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('monthPickerRef') monthPickerRef!: ElementRef<HTMLDivElement>;

    constructor(private utilsService: UtilsService) {
        if (this.month === 0) {
            this.listDate = utilsService.generateDateRangeNext(this.initialDate, 20);
        } else {
            const today = new Date();
            this.listDate = utilsService.getDaysInMonth(today.getFullYear(), this.month);
        }
    }

    ngAfterViewInit(): void {
        this.scrollToActiveDate(this.activeDate);
        this.scrollToActiveMonth('mont' + this.month);
    }

    scrollToActiveDateAndMonth() {
        // Assuming each element has a unique ID like item-0, item-1, etc.
        const activeDateInList = document.getElementById(this.activeDate);
        const activeMontInList = document.getElementById('month' + this.month);
        if (activeDateInList && this.datePickerRef) {
            // Get the list container element
            const container = this.datePickerRef.nativeElement;

            // Scroll the container to ensure the active element is in the middle
            container.scrollBy({
                left: activeDateInList.offsetLeft - container.clientWidth + activeDateInList.clientWidth / 2,
                behavior: 'smooth',
            });
        }

        if (activeMontInList && this.monthPickerRef) {
            // Get the list container element
            const container = this.monthPickerRef.nativeElement;

            // Scroll the container to ensure the active element is in the middle
            container.scrollBy({
                left: activeMontInList.offsetLeft - container.clientWidth + activeMontInList.clientWidth / 2,
                behavior: 'smooth',
            });
        }
    }

    scrollToActiveDate(selector: string) {
        const activeDateInList = document.getElementById(selector);
        if (activeDateInList && this.datePickerRef) {
            // Get the list container element
            const container = this.datePickerRef.nativeElement;

            // Scroll the container to ensure the active element is in the middle
            container.scrollBy({
                left: activeDateInList.offsetLeft - container.clientWidth + activeDateInList.clientWidth / 2,
                behavior: 'smooth',
            });
        }
    }

    scrollToActiveMonth(selector: string) {
        const activeMontInList = document.getElementById(selector);
        if (activeMontInList && this.monthPickerRef) {
            // Get the list container element
            const container = this.monthPickerRef.nativeElement;

            // Scroll the container to ensure the active element is in the middle
            container.scrollBy({
                left: activeMontInList.offsetLeft - container.clientWidth + activeMontInList.clientWidth / 2,
                behavior: 'smooth',
            });
        }
    }

    handleMonthClick(month: number) {
        if (this.moveDistance < 5) {
            const today = new Date();
            let oldActiveDate = new Date(this.activeDate);
            let newDate = new Date(today.getFullYear(), month, 0);
            let date = new Date(today.getFullYear(), month - 1, oldActiveDate.getDate() + 1);
            this.onChooseMonth.emit(month);
            this.month = month;
            this.listDate = this.utilsService.getDaysInMonth(today.getFullYear(), month);
            if (oldActiveDate.getDate() <= newDate.getDate()) {
                this.activeDate = date.toISOString().split('T')[0] + 'T00:00:00';
            } else {
                let nDate = new Date(today.getFullYear(), month - 1, newDate.getDate() + 1);
                this.activeDate = nDate.toISOString().split('T')[0] + 'T00:00:00';
            }
        }
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

    handleMouseDown(e: Event, target: 'date' | 'month') {
        this.isMouseDown = true;
        if (this.datePickerRef !== null && target === 'date') {
            this.startX = (e as MouseEvent).pageX - this.datePickerRef.nativeElement.offsetLeft;
            this.scrollLeft = this.datePickerRef.nativeElement.scrollLeft;
        }

        if (this.monthPickerRef !== null && target === 'month') {
            this.startX = (e as MouseEvent).pageX - this.monthPickerRef.nativeElement.offsetLeft;
            this.scrollLeft = this.monthPickerRef.nativeElement.scrollLeft;
        }
        this.moveDistance = 0;
    }

    handleMouseLeave() {
        this.isMouseDown = false;
    }

    handleMouseUp() {
        this.isMouseDown = false;
    }

    handleMouseMove(e: Event, target: 'date' | 'month') {
        if (!this.isMouseDown) return;
        e.preventDefault();
        if (this.datePickerRef !== null && target === 'date') {
            const x = (e as MouseEvent).pageX - this.datePickerRef.nativeElement.offsetLeft;
            const walk = (x - this.startX) * 1;
            this.datePickerRef.nativeElement.scrollLeft = this.scrollLeft - walk;
            this.moveDistance += Math.abs(walk);
        }

        if (this.monthPickerRef !== null && target === 'month') {
            const x = (e as MouseEvent).pageX - this.monthPickerRef.nativeElement.offsetLeft;
            const walk = (x - this.startX) * 1;
            this.monthPickerRef.nativeElement.scrollLeft = this.scrollLeft - walk;
            this.moveDistance += Math.abs(walk);
        }
    }
}
