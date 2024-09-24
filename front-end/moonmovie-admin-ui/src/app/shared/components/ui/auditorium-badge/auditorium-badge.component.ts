import { NgClass, NgIf } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-auditorium-badge',
    standalone: true,
    imports: [NgClass, NgIf],
    templateUrl: './auditorium-badge.component.html',
    styleUrl: './auditorium-badge.component.css',
})
export class AuditoriumBadgeComponent implements OnInit {
    @Input() colorIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = 0;
    @Input() loading: boolean = false;
    @Input() hall: string = '';
    @Input() subInfo: string = '';
    @Input() active: boolean = false;
    @Output() chooseAuditorium = new EventEmitter<void>();

    listColors: string[] = ['red', 'blue', 'yellow', 'indigo', 'orange', 'green', 'teal', 'cyan', 'violet', 'rose'];
    background: string = 'red';

    ngOnInit(): void {
        this.background = this.listColors[this.colorIndex];
    }

    handleChooseAuditorium() {
        this.chooseAuditorium.emit();
    }
}
