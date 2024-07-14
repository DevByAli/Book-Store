import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { NavbarAvatarComponent } from '../navbar-avatar/navbar-avatar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService, AuthToken } from '../../services/auth.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    SearchBarComponent,
    MatIconModule,
    MatInputModule,
    ShoppingCartComponent,
    NavbarAvatarComponent,
    NotificationComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  avatar: string = '';
  showSearch = false;

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const { avatar } = jwtDecode(
      this.authService.token!
    ) as JwtPayload as AuthToken;

    if (avatar) {
      this.avatar = avatar;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSelectProfile() {
    this.router.navigate(['/profile']);
  }

  onSelectOrders() {
    this.router.navigate(['/order-list']);
  }

  onSelectStore() {
    this.router.navigate(['/store']);
  }

  onSelectTags() {
    this.router.navigate(['/tags']);
  }

  onAddBook() {
    this.router.navigate(['/add-book']);
  }

  onSelectBrand() {
    if (this.authService.isAdmin) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/store']);
    }
  }

  onSelectLogout() {
    this.authService
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }
}
