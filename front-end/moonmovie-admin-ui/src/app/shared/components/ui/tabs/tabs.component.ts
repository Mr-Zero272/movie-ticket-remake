import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { LabelAndValue } from '../../../models/labelAndValue';
import { NgClass, NgFor, NgIf } from '@angular/common';

interface Tab extends LabelAndValue {}

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [NgClass, NgFor],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.css',
})
export class TabsComponent implements OnInit {
    @Input() tabsData: Tab[] = [];

    innerData: Tab[] = [];
    @Input() activeTab: Tab | null = null;
    @Output() onChooseTab = new EventEmitter<LabelAndValue>();

    ngOnInit(): void {
        this.innerData = this.tabsData;
        this.activeTab = this.innerData[0];
        if (window.innerWidth <= 768) {
            this.innerData = this.innerData.slice(0, 3);
        }
    }

    @HostListener('window:resize', ['$event.target.innerWidth'])
    onResize(width: number) {
        if (width <= 768) {
            this.innerData = this.innerData.slice(0, 3);
        } else {
            this.innerData = this.tabsData;
        }
    }

    handleChooseTab(tab: Tab) {
        this.activeTab = tab;
        this.onChooseTab.emit(tab);
    }
}
