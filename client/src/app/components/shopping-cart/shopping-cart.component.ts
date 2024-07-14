import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItem, CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  totalAmount: number = 0;
  deletingItemId: string | null = null;
  increasingItemId: string | null = null;
  decreasingItemId: string | null = null;
  isCheckingOut: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items;
        this.totalAmount = this.getTotalAmount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteItem(itemId: string) {
    this.deletingItemId = itemId;

    this.cartService
      .deleteItem(itemId)
      .pipe(
        finalize(() => (this.deletingItemId = null)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          console.log(error);
        },
      });
  }

  decreaseQuantity(id: string) {
    this.decreasingItemId = id;

    this.cartService
      .decreaseItemCount(id)
      .pipe(
        finalize(() => (this.decreasingItemId = null)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  increaseQuantity(id: string) {
    this.increasingItemId = id;

    this.cartService
      .increaseItemCount(id)
      .pipe(
        finalize(() => (this.increasingItemId = null)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getItemCount() {
    return this.cartService.getItemCount();
  }

  getItemQuantity(id: string) {
    return this.cartService.getItemQuantity(id);
  }

  getTotalAmount() {
    return this.cartService.getTotalAmount();
  }

  onCheckout() {
    this.isCheckingOut = true;

    this.cartService
      .checkout()
      .pipe(
        finalize(() => (this.isCheckingOut = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ sessionUrl }) => {
          window.location.href = sessionUrl;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
