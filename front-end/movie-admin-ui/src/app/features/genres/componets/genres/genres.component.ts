import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { Pagination } from '../../../../shared/models/pagination-obj.model';
import { Genre } from '../../../../shared/models/genre.model';
import { Column, Sort } from '../../../../shared/models/table';
import { GenresService } from '../../services/genres.service';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss',
})
export class GenresComponent implements AfterViewInit, OnInit {
  columns: Array<Column> = [];
  genresData!: Pagination<Genre>;
  currentSearchValue: string = '';
  loading: boolean = false;
  sortData: Array<Sort> = [
    {
      label: 'Id',
      key: 'id',
      order: 'asc',
    },
    {
      label: 'Name',
      key: 'name',
      order: 'asc',
    },
  ];
  activeSort: Sort = this.sortData[0];

  constructor(
    private cdr: ChangeDetectorRef,
    private genresService: GenresService,
  ) {}

  ngOnInit(): void {
    this.handleFetchGenres({});
  }

  ngAfterViewInit(): void {
    this.columns = [
      { label: 'Id', key: 'id' }, // Default rendering
      { label: 'Name', key: 'name' },
    ];
    this.cdr.detectChanges();
  }

  handleFetchGenres({
    q = '',
    page = 1,
    size = 7,
    sort = 'name',
    sortOrder = 'asc',
  }: {
    q?: string;
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.genresService
      .fetchGenres({
        q: this.currentSearchValue,
        page,
        size,
        sort: this.activeSort.key,
        sortOrder: this.activeSort.order,
      })
      .subscribe((data) => {
        this.genresData = data;
      }).closed;
    this.loading = false;
  }

  handleChangePage(page: number) {
    this.handleFetchGenres({
      page: page,
    });
  }

  handleSearchChange(searchTerm: string) {
    this.currentSearchValue = searchTerm;
    this.handleFetchGenres({});
  }

  handleChangeSort(sort: Sort) {
    this.activeSort = sort;
    this.handleFetchGenres({});
  }
}
