import { Component, OnInit, OnChanges } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';
import { NgClass, NgFor, TitleCasePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [NgFor, NgClass, TitleCasePipe, RouterLink, JsonPipe],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): Array<{ label: string; url: string }> {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeURL !== '') {
        let previousRoutes = '';
        if (breadcrumbs.length !== 0) {
          previousRoutes = breadcrumbs[breadcrumbs.length - 1].url;
        }

        breadcrumbs.push({
          url: previousRoutes + `/${routeURL}`,
          label: routeURL,
        });
      }

      return this.createBreadcrumbs(child, routeURL, breadcrumbs);
    }

    return breadcrumbs;
  }

  trackByFn(index: number, item: { label: string; url: string }): string {
    return item.label;
  }
}
