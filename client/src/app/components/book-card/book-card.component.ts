import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinner,
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {
  @Input('bookId') bookId: string = '';
  @Input('url') imgUrl: string = '';
  @Input('title') title: string = '';
  @Input('author') author: string = '';
  @Input('price') price: number = 0;

  isAddingToCart: boolean = false;
  isIncrementingCount: boolean = false;
  isDecreamentingCount: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  addToCart() {
    this.isAddingToCart = true;

    this.cartService.addItem(this.bookId).subscribe({
      next: (res) => {
        this.isAddingToCart = false;
      },
      error: (error) => {
        console.log(error);
        this.isAddingToCart = false;
      },
    });
  }

  increaseItemCount() {
    this.isIncrementingCount = true;

    this.cartService.increaseItemCount(this.bookId).subscribe({
      next: () => {
        this.isIncrementingCount = false;
      },
      error: (error) => {
        console.log(error);
        this.isIncrementingCount = false;
      },
    });
  }

  decreaseItemCount() {
    this.isDecreamentingCount = true;

    this.cartService.decreaseItemCount(this.bookId).subscribe({
      next: () => {
        this.isDecreamentingCount = false;
      },
      error: (error) => {
        console.log(error);
        this.isDecreamentingCount = false;
      },
    });
  }

  getItemCount() {
    return this.cartService.getItemQuantity(this.bookId);
  }

  isItemInCart() {
    return this.cartService.isItemInCart(this.bookId);
  }

  onEdit() {
    this.router.navigate(['/edit-book'], { queryParams: { id: this.bookId } });
  }

  onBook(){
    this.router.navigate(['/book-details'], { queryParams: { id: this.bookId } });
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }
}
