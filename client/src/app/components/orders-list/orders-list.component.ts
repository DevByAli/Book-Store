import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Order, OrderService } from '../../services/order.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { CurrencyPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { ChipComponent } from '../chip/chip.component';
import { modifyBooksUrl } from '../../utils/modifyBooksUrl';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterComponent, Filters } from '../filter/filter.component';
import { SortComponent } from '../sort/sort.component';
import { ClearFilterComponent } from '../clear-filter/clear-filter.component';
import { MatMenuModule } from '@angular/material/menu';
import { STATUS } from '../../utils/constants';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ChipComponent,
    CurrencyPipe,
    DatePipe,
    MatDividerModule,
    MatProgressSpinnerModule,
    FilterComponent,
    SortComponent,
    ClearFilterComponent,
    KeyValuePipe,
    MatMenuModule,
    // IteratePipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  step = signal(-1);

  orders: Order[] = [];
  selectedOrder: string = '';
  pageNumber: number = 1;
  hasNextPage: boolean = false;
  isLoadMore: boolean = false;
  isLoadingOrder: boolean = false;
  changingStatusId: string | null = null;

  isAdmin: boolean = false;

  private destroy$ = new Subject<void>();

  filters: Filters = {
    pending: 'Pending Orders',
    shipped: 'Shipped Orders',
    cancelled: 'Cancelled Orders',
    delivered: 'Delivered Orders',
    processing: 'Processing Orders',
  };

  orderStatuses: string[] = [];

  selectedFilter: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    if (this.authService.isAdmin) {
      this.orderStatuses.push('processing', 'shipped', 'cancelled');
    } else {
      this.orderStatuses.push('delivered', 'cancelled');
    }
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    this.isLoadingOrder = true;
    this.setStep(-1);

    this.orderService
      .getAllOrders(this.pageNumber, this.selectedFilter, this.selectedOrder)
      .pipe(
        finalize(() => {
          this.isLoadingOrder = false;
          this.isLoadMore = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ orders, hasNextPage }) => {
          let tempOrder = orders.map((order) => {
            let books = order.items.map((item) => item.book);
            books = modifyBooksUrl(books, 40, 40);

            order.items.forEach((item, index) => {
              item.book = books[index];
            });
            return order;
          });

          if (this.isLoadMore) {
            this.orders.push(...tempOrder);
          } else {
            this.orders = tempOrder;
          }

          this.hasNextPage = hasNextPage;
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
    if (filter !== this.selectedFilter) {
      this.selectedFilter = filter;
      this.pageNumber = 1;
      this.ngOnInit();
    }
  }

  onSelectOrder(order: string) {
    if (order !== this.selectedOrder) {
      this.selectedOrder = order;
      this.pageNumber = 1;
      this.ngOnInit();
    }
  }

  onClearFilter() {
    this.selectedFilter = '';
    this.selectedOrder = '';
    this.pageNumber = 1;
    this.ngOnInit();
  }

  onLoadMore() {
    if (this.hasNextPage) {
      this.pageNumber += 1;
      this.isLoadMore = true;
      this.ngOnInit();
    }
  }

  onChangeStatus(orderId: string, status: string) {
    const order = this.orders.find(
      (order) => order.status === status && order.id === orderId
    );

    if (order?.status === STATUS.cancelled || order?.status === status) return;

    this.changingStatusId = orderId;

    this.orderService
      .changeOrderStatus(orderId, status)
      .pipe(
        finalize(() => (this.changingStatusId = null)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ order }) => {
          this.orders.forEach((order) => {
            if (order.id === orderId) {
              order.status = status;
              return;
            }
          });

          this.notificationService.emitChangeOrderStatusNotificationEvent(
            order._id,
            order.user
          );
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  isAllowToChangeStatus(status: string) {
    if (
      this.isAdmin &&
      (status === STATUS.cancelled ||
        status === STATUS.shipped ||
        status === STATUS.delivered)
    ) {
      return false;
    } else if (
      !this.isAdmin &&
      (status === STATUS.delivered || status === STATUS.cancelled)
    ) {
      return false;
    }
    return true;
  }

  isStatusMenuAllow(orderStatus: string, btnStatus: string) {
    if (!this.isAdmin) {
      if (
        (orderStatus === STATUS.pending || orderStatus === STATUS.processing) &&
        btnStatus === STATUS.cancelled
      ) {
        return true;
      } else if (
        orderStatus === STATUS.shipped &&
        btnStatus === STATUS.delivered
      ) {
        return true;
      } else {
        return false;
      }
    } else if (
      this.isAdmin &&
      orderStatus === STATUS.processing &&
      btnStatus === STATUS.processing
    ) {
      return false;
    }
    return true;
  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update((i) => i + 1);
  }

  prevStep() {
    this.step.update((i) => i - 1);
  }
}
