import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-dropdown-menu-item',
    standalone: true,
    imports: [NgIf],
    templateUrl: './dropdown-menu-item.component.html',
    styleUrl: './dropdown-menu-item.component.css',
})
export class DropdownMenuItemComponent {}
