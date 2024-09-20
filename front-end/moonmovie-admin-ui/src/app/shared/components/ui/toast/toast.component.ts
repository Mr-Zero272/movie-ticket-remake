import { Component } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TOAST_STATE, ToastService } from '../../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [NgIf, NgSwitchCase, NgSwitch, NgSwitchDefault, AsyncPipe],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css',
    animations: [
        trigger('toastTrigger', [
            // This refers to the @trigger we created in the template
            state('open', style({ transform: 'translateY(0%)' })), // This is how the 'open' state is styled
            state('close', style({ transform: 'translateY(-200%)', opacity: 0, display: 'none' })), // This is how the 'close' state is styled
            transition('open <=> close', [
                // This is how they're expected to transition from one to the other
                animate('300ms ease-in-out'),
            ]),
        ]),
    ],
})
export class ToastComponent {
    toastClass = ['toast-class'];

    constructor(public toast: ToastService) {}

    dismiss(): void {
        this.toast.dismissToast();
    }
}
