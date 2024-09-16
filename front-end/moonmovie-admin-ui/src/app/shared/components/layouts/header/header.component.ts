import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserButtonComponent } from '../../auth/user-button/user-button.component';
import { BreadcrumbsComponent } from '../../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, UserButtonComponent, BreadcrumbsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
