import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BookService, Books } from '../../services/book.service';
import { Book } from '../book-store/book-store.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnDestroy {
  private searchSubscription: Subscription | null = null;
  private searchTerms = new Subject<string>();

  searchResult: Book[] = [];

  constructor(private bookService: BookService, private router: Router) {
    this.searchSubscription = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.bookService.searchBooks(term))
      )
      .subscribe({
        next: (res: Books) => {
          this.searchResult = res.books;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearch(query: string, pressEnter: boolean = false): void {
    if (query && !pressEnter) {
      this.searchTerms.next(query);
    } else if (query && pressEnter) {
      this.router.navigate(['/searched-result'], {
        queryParams: {
          search: query,
        },
      });
    }
  }

  onSelectSearchResult(title: string) {
    this.router.navigate(['/searched-result'], {
      queryParams: {
        search: title,
      },
    });
  }
}
