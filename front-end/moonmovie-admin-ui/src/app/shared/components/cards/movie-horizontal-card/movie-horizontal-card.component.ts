import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-movie-horizontal-card',
    standalone: true,
    imports: [NgIf, NgClass, RouterLink],
    templateUrl: './movie-horizontal-card.component.html',
    styleUrl: './movie-horizontal-card.component.css',
})
export class MovieHorizontalCardComponent {
    @Input() loading: boolean = false;
    @Input() class: string = '';
    @Input() userId: string = '123';
    @Input() movieId: number = 0;
    @Input() poster: string = 'https://i.pinimg.com/736x/52/8a/9a/528a9ae2e2db9978ca5168eadd6c2735.jpg';
    @Input() title: string = "What's your Schedule Looks Like?";
    @Input() runtime: number = 123;
    @Input() firstGenre: string = 'Action';
    @Input() love: boolean = false;
}
