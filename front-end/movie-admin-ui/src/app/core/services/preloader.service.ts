import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PreloaderService {
    private selector = 'globalLoader';

    constructor(@Inject(DOCUMENT) private document: Document) {}

    private getElement() {
        return this.document.getElementById(this.selector);
    }

    hide() {
        const el = this.getElement();
        if (el) {
            el.classList.add('hidden');
        }
    }
}
