import { DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { DropdownMenuItemComponent } from '../../../../shared/components/ui/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuComponent } from '../../../../shared/components/ui/dropdown-menu/dropdown-menu.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { User } from '../../../../shared/models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        DropdownMenuComponent,
        DropdownMenuItemComponent,
        PaginationComponent,
        FormsModule,
        NgFor,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgClass,
        DatePipe,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
    isSortMenuOpen: boolean = false;
    usersPagination!: Pagination<User>;
    searchInput = new Subject<string>();
    searchValue: string = '';
    sortBy: string = 'createdAt';
    sortOrder: string = 'asc';

    constructor(private usersService: UsersService) {
        this.searchInput.pipe(debounceTime(500)).subscribe((searchTerm: string) => {
            // Call your search function here
            this.performSearch(searchTerm);
        });
    }

    ngOnInit(): void {
        this.callFetchUsersApi({});
    }

    toggleMenuSort() {
        this.isSortMenuOpen = !this.isSortMenuOpen;
    }

    callFetchUsersApi({
        page = 1,
        size = 7,
        usernameOrEmail = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    }: {
        page?: number;
        size?: number;
        usernameOrEmail?: string;
        sortBy?: string;
        sortOrder?: string;
    }) {
        this.usersService.fetchUsers({ page, size, usernameOrEmail, sortBy, sortOrder }).subscribe((userPagination) => {
            this.usersPagination = userPagination;
        }).closed;
    }

    handleNextPage(page: number) {
        this.callFetchUsersApi({ page });
    }

    handlePrevPage(page: number) {
        this.callFetchUsersApi({ page });
    }

    handleChoosePage(page: number) {
        this.callFetchUsersApi({ page });
    }

    onSearchInputChange(event: Event) {
        this.searchInput.next((event.target as HTMLInputElement).value);
    }

    performSearch(searchTerm: string) {
        this.callFetchUsersApi({ page: 1, size: 7, usernameOrEmail: searchTerm });
    }

    changeSortOrder(sortBy: string) {
        if (this.sortBy !== sortBy) return;
        const newSortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.sortOrder = newSortOrder;
        this.callFetchUsersApi({
            page: 1,
            size: 7,
            usernameOrEmail: this.searchValue,
            sortBy: this.sortBy,
            sortOrder: newSortOrder,
        });
    }

    changeSortBy(sortBy: string) {
        if (this.sortBy === sortBy) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = sortBy;
        }
        this.callFetchUsersApi({
            page: 1,
            size: 7,
            usernameOrEmail: this.searchValue,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
        });

        this.isSortMenuOpen = !this.isSortMenuOpen;
    }

    ngOnDestroy() {
        this.searchInput.complete();
    }
}
