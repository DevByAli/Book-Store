import { Component, OnDestroy, OnInit } from '@angular/core';
import { TotalEarningComponent } from '../total-earning/total-earning.component';
import { MatCardModule } from '@angular/material/card';
import { COUNTRIES } from '../../utils/country';
import { MatDividerModule } from '@angular/material/divider';
import { TopCustomerCountriesComponent } from '../top-customer-countries/top-customer-countries.component';
import { MostSellingBooksComponent } from '../most-selling-books/most-selling-books.component';
import { MatChipsModule } from '@angular/material/chips';
import { MostSellingCategoryComponent } from '../most-selling-category/most-selling-category.component';
import { OrdersListComponent } from '../orders-list/orders-list.component';
import {
  MostSellingBook,
  MostSellingCategory,
  StatsService,
  TopCountry,
} from '../../services/stats.service';
import { combineLatest, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { modifyCloudinaryUrl } from '../../utils/modifyCloudinaryUrl';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TotalEarningComponent,
    MatCardModule,
    MatDividerModule,
    TopCustomerCountriesComponent,
    MostSellingBooksComponent,
    MatChipsModule,
    MostSellingCategoryComponent,
    OrdersListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalEarning: number = 0;
  selectedEarningFilter: string = 'week';
  earningFilter: string[] = ['week', 'month', 'year'];
  topCustomerCountries: TopCountry[] = [];
  mostSellingBooks: MostSellingBook[] = [];
  mostSellingCategory: MostSellingCategory[] = [];

  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.statsService
      .getTotalEarning(this.selectedEarningFilter)
      .pipe(
        finalize(() => (this.isLoading = false)),
        switchMap((totalEarning) => {
          this.totalEarning = totalEarning.earnings;
          return combineLatest([
            this.statsService.getMostSellingBooks(),
            this.statsService.getMostSellingCategory(),
            this.statsService.getTopCountriesByBookSales(),
          ]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ([
          mostSellingBooks,
          mostSellingCategory,
          topCustomerCountries,
        ]) => {
          this.mostSellingBooks = mostSellingBooks.mostSellingBooks.map(
            (book) => {
              return {
                ...book,
                url: modifyCloudinaryUrl(book.url, 40, 40),
              };
            }
          );
          this.mostSellingCategory = mostSellingCategory.mostSellingTags;
          this.topCustomerCountries = topCustomerCountries.topCountries.map(
            ({ country, totalQuantity }) => {
              return {
                country: COUNTRIES[country],
                totalQuantity,
              };
            }
          );
        },
        error: (error) => {
          console.error('Error loading dashboard data', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectingEarningFilter(filter: string) {
    this.selectedEarningFilter = filter;
    this.loadTotalEarning();
  }

  private loadTotalEarning() {
    this.statsService
      .getTotalEarning(this.selectedEarningFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (totalEarning) => {
          this.totalEarning = totalEarning.earnings;
        },
        error: (error) => {
          console.error('Error loading total earning', error);
        },
      });
  }
}
