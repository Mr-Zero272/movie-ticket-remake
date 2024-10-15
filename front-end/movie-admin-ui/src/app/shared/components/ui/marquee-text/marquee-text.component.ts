import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-marquee-text',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './marquee-text.component.html',
  styleUrl: './marquee-text.component.css',
})
export class MarqueeTextComponent implements AfterViewInit {
  @Input({ required: true }) text: string = '';
  @Input() duration: number = 2000;
  @Input() class: string = '';
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('textRef') textRef!: ElementRef<HTMLDivElement>;

  isOverFlowing: boolean = false;
  scrollPosition: number = 0;

  ngAfterViewInit(): void {
    if (this.containerRef && this.textRef) {
      const textWidth = this.textRef.nativeElement.scrollWidth;
      const containerWidth = this.containerRef.nativeElement.offsetWidth;
      this.isOverFlowing = textWidth > containerWidth;
    }
  }

  handleMouseEnter() {
    if (this.isOverFlowing) {
      const textWidth = this.textRef.nativeElement?.scrollWidth ?? 0;
      const containerWidth = this.containerRef.nativeElement?.offsetWidth ?? 0;
      this.scrollPosition = textWidth - containerWidth;
      setTimeout(
        () => {
          this.scrollPosition = 0;
        },
        this.duration ? this.duration * 1000 + 2000 : 2000,
      );
    }
  }
}
