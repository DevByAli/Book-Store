import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book-store/book-store.component';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, of } from 'rxjs';
import { SortComponent } from '../sort/sort.component';
import { FilterComponent, Filters } from '../filter/filter.component';
import { BookCardComponent } from '../book-card/book-card.component';
import { modifyBooksUrl } from '../../utils/modifyBooksUrl';
import { BookService, Books } from '../../services/book.service';
import { MatButtonModule } from '@angular/material/button';
import { ClearFilterComponent } from '../clear-filter/clear-filter.component';
import { getBookFilters } from '../../utils/filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-searched-result',
  standalone: true,
  imports: [
    SortComponent,
    FilterComponent,
    BookCardComponent,
    MatButtonModule,
    ClearFilterComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './searched-result.component.html',
  styleUrl: './searched-result.component.css',
})
export class SearchedResultComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  books: Book[] = [];
  hasNextPage: boolean = false;
  pageNumber: number = 1;
  filter: string = '';
  order: string = '';
  isLoadMore: boolean = false;

  isLoading: boolean = false;

  filters: Filters = {};

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.filters = getBookFilters();

    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          this.searchQuery = params['search'] || '';

          if (this.searchQuery) {
            return this.bookService
              .searchBooks(
                this.searchQuery,
                true,
                this.pageNumber,
                this.filter,
                this.order
              )
              .pipe(
                finalize(() => {
                  this.isLoadMore = false;
                  this.isLoading = false;
                }),
                takeUntil(this.destroy$)
              );
          } else {
            return of([]);
          }
        })
      )
      .subscribe({
        next: (res: Books) => {
          if (res && res.books) {
            const modifiedBooks = modifyBooksUrl(res.books, 300, 200);
            if (this.isLoadMore) {
              this.books.push(...modifiedBooks);
            } else {
              this.books = modifiedBooks;
            }
            this.hasNextPage = res.hasNextPage;
          }
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

  onSelectFilter(filter: string) {
    this.filter = filter;
    this.books = [];
    this.pageNumber = 1;
    this.ngOnInit();
  }

  onSelectOrder(order: string) {
    this.order = order;
    this.books = [];
    this.pageNumber = 1;
    this.ngOnInit();
  }

  onClearFilter() {
    this.filter = '';
    this.order = '';
    this.pageNumber = 1;
    this.books = [];
    this.ngOnInit();
  }

  loadMore() {
    if (this.hasNextPage) {
      this.pageNumber += 1;
      this.isLoadMore = true;
      this.ngOnInit();
    }
  }
}
