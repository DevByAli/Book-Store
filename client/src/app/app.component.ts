import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookStoreComponent } from './components/book-store/book-store.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { TagComponent } from './components/tag/tag.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchedResultComponent } from './components/searched-result/searched-result.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileImageComponent,
    NavbarComponent,
    FooterComponent,
    BookCardComponent,
    BookStoreComponent,
    BookDetailsComponent,
    AddBookComponent,
    OrdersListComponent,
    TagComponent,
    SearchedResultComponent,
    DashboardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'book-store';
}
