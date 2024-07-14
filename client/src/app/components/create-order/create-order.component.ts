import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Order, OrderService } from '../../services/order.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  isOrderPlaced: boolean = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap((query) => {
          const session_id = query['session_id'];

          if (session_id) {
            return this.orderService.createOrder(session_id);
          } else {
            return [];
          }
        })
      )
      .subscribe({
        next: (res: any) => {
          this.isOrderPlaced = true;
          this.notificationService.emitNewOrderNotificationEvent(res.order._id);
        },
        error: ({ error }) => {
          this.errorMessage = error.message;
        },
      });
  }

  onBackToStore() {
    this.router.navigate(['/store']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
