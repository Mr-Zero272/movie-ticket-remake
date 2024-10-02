import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieScheduleVerticalCardComponent } from '../../../../shared/components/cards/movie-schedule-vertical-card/movie-schedule-vertical-card.component';
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component';
import { AuditoriumBadgeComponent } from '../../../../shared/components/ui/auditorium-badge/auditorium-badge.component';
import { MarqueeTextComponent } from '../../../../shared/components/ui/marquee-text/marquee-text.component';
import { ShowingBadgeComponent } from '../showing-badge/showing-badge.component';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        MovieScheduleVerticalCardComponent,
        AuditoriumBadgeComponent,
        DatePickerComponent,
        MarqueeTextComponent,
        ShowingBadgeComponent,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailScheduleComponent {
    scheduleId: string | null = null;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        // Subscribe to the route parameters to get the `id`
        this.route.paramMap.subscribe((params) => {
            this.scheduleId = params.get('id');
            // Fetch product details using the `productId`
            console.log('Product ID: ', this.scheduleId);
            // You can use this `productId` to make an API call and fetch product details
        });
    }

    test(e: Event) {
        const tDate = (e.target as HTMLSpanElement).dataset['date'];
        if (tDate) {
            const date = new Date(+tDate);
            console.log(date.toDateString());
        }
    }
}
