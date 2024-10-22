import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AvatarFirstLetterComponent } from '../avatar-first-letter/avatar-first-letter.component';
import { Column, Sort } from '../../../../shared/models/table';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { Hall } from '../../../../shared/models/hall.model';
import { HallService } from '../../services/hall.service';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { EditHallDialogComponent } from '../edit-hall-dialog/edit-hall-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuditoriumBadgeComponent } from '../../../../shared/components/ui/auditorium-badge/auditorium-badge.component';

@Component({
  selector: 'app-hall',
  standalone: true,
  imports: [
    AvatarFirstLetterComponent,
    TableComponent,
    ButtonComponent,
    EditHallDialogComponent,
    DatePipe,
    AuditoriumBadgeComponent,
  ],
  templateUrl: './hall.component.html',
  styleUrl: './hall.component.scss',
})
export class HallComponent implements OnInit, AfterViewInit, AfterContentInit {
  columns: Array<Column> = [];
  hallsData!: Pagination<Hall>;
  currentSearchValue: string = '';
  loading: boolean = false;
  sortData: Array<Sort> = [
    {
      label: 'Name',
      key: 'name',
      order: 'asc',
    },
    {
      label: 'Id',
      key: 'id',
      order: 'asc',
    },
    {
      label: 'Address',
      key: 'address',
      order: 'asc',
    },
    {
      label: 'Created At',
      key: 'createdAt',
      order: 'asc',
    },
    {
      label: 'Last Modified',
      key: 'modifiedAt',
      order: 'asc',
    },
  ];
  activeSort: Sort = this.sortData[0];
  @ViewChild('hallNameTemplate', { static: true }) hallNameTemplate!: TemplateRef<any>;
  @ViewChild('hallNameTemplateLoading', { static: true }) hallNameTemplateLoading!: TemplateRef<any>;
  @ViewChild('createdAtTemplate', { static: true }) createdAtTemplate!: TemplateRef<any>;
  @ViewChild('lastModifiedTemplate', { static: true }) lastModifiedTemplate!: TemplateRef<any>;

  // dialog edit hall information
  readonly dialog = inject(MatDialog);

  constructor(
    private cdr: ChangeDetectorRef,
    private hallService: HallService,
  ) {}

  ngOnInit(): void {
    this.handleFetchHalls({});
  }

  ngAfterContentInit(): void {
    this.handleFetchHalls({});
    this.hallService.getHallData().subscribe((data) => {
      this.hallsData = data;
    });
  }

  ngAfterViewInit(): void {
    this.columns = [
      { label: 'Hall', key: 'name', template: this.hallNameTemplate, templateLoading: this.hallNameTemplateLoading },
      { label: 'Id', key: 'id' },
      { label: 'Address', key: 'address' },
      { label: 'Created At', key: 'createdAt', template: this.createdAtTemplate },
      { label: 'Last Modified', key: 'modifiedAt', template: this.lastModifiedTemplate },
    ];
    this.cdr.detectChanges();
  }

  handleFetchHalls({
    query = '',
    page = 1,
    size = 7,
    sort = 'none',
    sortOrder = 'asc',
  }: {
    query?: string;
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.hallService
      .fetchHalls({
        query: this.currentSearchValue,
        page,
        size,
        sort: this.activeSort.key,
        sortOrder: this.activeSort.order,
      })
      .subscribe().closed;
    this.loading = false;
  }

  handleChangePage(page: number) {
    this.handleFetchHalls({
      page: page,
    });
  }

  handleSearchChange(searchTerm: string) {
    this.currentSearchValue = searchTerm;
    this.handleFetchHalls({});
  }

  handleChangeSort(sort: Sort) {
    this.activeSort = sort;
    this.handleFetchHalls({});
  }

  openDialog(hall: Hall): void {
    const dialogRef = this.dialog.open(EditHallDialogComponent, {
      data: hall,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
      }
    });
  }
}
