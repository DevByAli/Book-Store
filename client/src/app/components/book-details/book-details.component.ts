import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookDetails, BookService } from '../../services/book.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, of, switchMap, takeUntil } from 'rxjs';
import { Book } from '../book-store/book-store.component';
import { modifyCloudinaryUrl } from '../../utils/modifyCloudinaryUrl';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.route.queryParamMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          const bookId = param.get('id');

          if (bookId) {
            return this.bookService.getBook(bookId).pipe(
              takeUntil(this.destroy$),
              finalize(() => (this.isLoading = false))
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (res: BookDetails | null) => {
          if (res) {
            res.book.url = modifyCloudinaryUrl(res.book.url, 500, 400);
            this.book = res.book;
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
