import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sort-icon',
    standalone: true,
    imports: [NgIf],
    templateUrl: './sort-icon.component.html',
    styleUrl: './sort-icon.component.css',
})
export class SortIconComponent {
    @Input() sortOrder: 'desc' | 'asc' = 'desc';
}
