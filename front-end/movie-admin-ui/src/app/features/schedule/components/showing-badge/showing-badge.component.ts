import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MarqueeTextComponent } from '../../../../shared/components/ui/marquee-text/marquee-text.component';

@Component({
    selector: 'app-showing-badge',
    standalone: true,
    imports: [DatePipe, MarqueeTextComponent, NgIf, NgClass],
    templateUrl: './showing-badge.component.html',
    styleUrl: './showing-badge.component.css',
})
export class ShowingBadgeComponent implements OnInit {
    @Input() index = 1;
    @Input() colorIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = 0;
    @Input() loading: boolean = false;
    @Input() title: string = 'Hello world';
    @Input() time: string = '2024-09-22T00:00:00';
    @Input() active: boolean = false;

    listColors: string[] = ['red', 'blue', 'yellow', 'indigo', 'orange', 'green', 'teal', 'cyan', 'violet', 'rose'];
    background: string = 'green';

    ngOnInit(): void {
        this.background = this.listColors[this.colorIndex];
    }
}
