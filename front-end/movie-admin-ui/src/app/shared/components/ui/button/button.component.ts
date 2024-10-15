import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() class: string = '';
  @Input() variant: 'primary' | 'outline' | 'alternative' | 'link' = 'primary';
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() href: string = '';
  @Output() click = new EventEmitter<void>();

  classBaseOnVariant = {
    primary:
      'bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800',
    alternative:
      'border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-orange-500 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700',
    outline:
      'text-orange-400 border border-orange-500 hover:bg-gray-100/50 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:border-orange-400 dark:text-orange-400 dark:focus:ring-orange-900',
    link: 'hover:underline',
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
  ) {}

  // Pass all other attributes dynamically
  @Input() set attributes(attrs: { [key: string]: string }) {
    Object.keys(attrs).forEach((attr) => {
      this.renderer.setAttribute(this.el.nativeElement.querySelector('button'), attr, attrs[attr]);
    });
  }

  handleClick(e: MouseEvent) {
    e.stopPropagation();
    if (this.href !== '') {
      e.preventDefault();
      this.router.navigate([this.href]);
    } else {
      this.click.emit();
    }
  }
}
