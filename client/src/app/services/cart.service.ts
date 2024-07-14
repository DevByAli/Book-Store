// cart.service.ts
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { BASE_URL } from '../utils/constants';
import { Book } from '../components/book-store/book-store.component';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

export interface Checkout {
  sessionUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart() {
    this.http
      .get<Cart>(`${BASE_URL}/get-all-cart-items`, {
        withCredentials: true,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ items }: Cart) => {
          this.itemsSubject.next(items);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addItem(id: string) {
    return this.http
      .post<CartItem>(
        `${BASE_URL}/add-to-cart`,
        { id },
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => this.loadCart()),
        catchError(this.handleError)
      );
  }

  deleteItem(itemId: string) {
    return this.http
      .delete<any>(`${BASE_URL}/delete-from-cart/${itemId}`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => this.loadCart()),
        catchError(this.handleError)
      );
  }

  decreaseItemCount(itemId: string) {
    return this.http
      .patch(`${BASE_URL}/decrement-book-count/${itemId}`, null, {
        withCredentials: true,
      })
      .pipe(
        tap(() => this.loadCart()),
        catchError(this.handleError)
      );
  }

  increaseItemCount(itemId: string) {
    return this.addItem(itemId);
  }

  getItemCount() {
    return this.itemsSubject.value.length;
  }

  getItemQuantity(id: string): number {
    const item = this.itemsSubject.value.find((item) => item.book._id === id);
    return item ? item.quantity : 0;
  }

  getTotalAmount() {
    return this.itemsSubject.value.reduce((totalAmount, item) => {
      return totalAmount + item.book.price * item.quantity;
    }, 0);
  }

  isItemInCart(id: string) {
    return this.itemsSubject.value.find((item) => item.book._id === id);
  }

  checkout() {
    return this.http
      .post<Checkout>(
        `${BASE_URL}/checkout`,
        {
          items: this.itemsSubject.value,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => error);
  }
}
