import { DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { DropdownMenuItemComponent } from '../../../../shared/components/ui/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuComponent } from '../../../../shared/components/ui/dropdown-menu/dropdown-menu.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { User } from '../../../../shared/models/user.model';
import { Column, Sort } from '../../../../shared/models/table';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { UsersService } from '../../services/users.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, TableComponent, ButtonComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, AfterViewInit {
  columns: Array<Column> = [];
  userData!: Pagination<User>;
  currentSearchValue: string = '';
  loading: boolean = false;
  sortData: Array<Sort> = [
    {
      label: 'User',
      key: 'email',
      order: 'asc',
    },
    {
      label: 'Username',
      key: 'username',
      order: 'asc',
    },
    {
      label: 'Las signed in',
      key: 'lastSignedIn',
      order: 'asc',
    },
    {
      label: 'Joined',
      key: 'createdAt',
      order: 'asc',
    },
  ];
  activeSort: Sort = this.sortData[0];
  @ViewChild('userInfoTemplate', { static: true }) userInfoTemplate!: TemplateRef<any>;
  @ViewChild('userInfoTemplateLoading', { static: true }) userInfoTemplateLoading!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.handleFetchUser({});
  }

  ngAfterViewInit(): void {
    this.columns = [
      { label: 'User', key: 'email', template: this.userInfoTemplate, templateLoading: this.userInfoTemplateLoading },
      { label: 'Username', key: 'username' },
      { label: 'Las signed in', key: 'lastSignedIn' },
      { label: 'Joined', key: 'createdAt' },
    ];
    this.cdr.detectChanges();
  }

  handleFetchUser({ page = 1, size = 7 }: { page?: number; size?: number }) {
    if (this.loading) return;
    this.loading = true;
    this.usersService
      .fetchUsers({
        page,
        size,
        usernameOrEmail: this.currentSearchValue,
        sortBy: this.activeSort.key,
        sortOrder: this.activeSort.order,
      })
      .subscribe((userPagination) => {
        this.userData = userPagination;
      }).closed;
    this.loading = false;
  }

  handleChangePage(page: number) {
    this.handleFetchUser({
      page: page,
    });
  }

  handleSearchChange(searchTerm: string) {
    this.currentSearchValue = searchTerm;
    this.handleFetchUser({});
  }

  handleChangeSort(sort: Sort) {
    this.activeSort = sort;
    this.handleFetchUser({});
  }
}
