import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-dropdown-menu',
    standalone: true,
    imports: [OutsideClickDirective, NgIf],
    templateUrl: './dropdown-menu.component.html',
    styleUrl: './dropdown-menu.component.css',
})
export class DropdownMenuComponent {
    @Input() isMenuOpen: boolean = false;
    @Output() toggleMeuEvent = new EventEmitter<void>();
    tempOpen: boolean = true;

    toggleUserMenu() {
        console.log(this.isMenuOpen);

        this.toggleMeuEvent.emit();
    }
}
