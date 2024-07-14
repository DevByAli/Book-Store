import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { modifyBooksUrl } from '../../utils/modifyBooksUrl';
import { MatButtonModule } from '@angular/material/button';
import { FilterComponent, Filters } from '../filter/filter.component';
import { SortComponent } from '../sort/sort.component';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ClearFilterComponent } from '../clear-filter/clear-filter.component';
import { getBookFilters } from '../../utils/filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  tags: Array<string>;
  url: string;
  cloudinaryId: string;
  purchased: number;
}

@Component({
  selector: 'app-book-store',
  standalone: true,
  imports: [
    BookCardComponent,
    MatButtonModule,
    FilterComponent,
    SortComponent,
    ClearFilterComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-store.component.html',
  styleUrl: './book-store.component.css',
})
export class BookStoreComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  hasNextPage: Boolean = false;
  pageNumber: number = 1;
  filter: string = '';
  order: string = '';

  isLoading: boolean = false;

  filters: Filters = {};

  private destroy$ = new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.filters = getBookFilters();

    this.bookService
      .getBooks(this.pageNumber, this.filter, this.order)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res) => {
          this.books.push(...modifyBooksUrl(res.books, 300, 200));
          this.hasNextPage = res.hasNextPage;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMore() {
    if (this.hasNextPage) {
      this.pageNumber += 1;
      this.ngOnInit();
    }
  }

  onSelectFilter(filter: string) {
    if (filter !== this.filter) {
      this.filter = filter;
      this.books = [];
      this.pageNumber = 1;
      this.ngOnInit();
    }
  }

  onSelectOrder(order: string) {
    if (order !== this.order) {
      this.order = order;
      this.books = [];
      this.pageNumber = 1;
      this.ngOnInit();
    }
  }

  onClearFilter() {
    this.filter = '';
    this.order = '';
    this.pageNumber = 1;
    this.books = [];
    this.ngOnInit();
  }
}
