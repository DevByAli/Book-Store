import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { merge, Subject, take, takeUntil } from 'rxjs';
import { Notification } from '../../services/notification.service';
import { MatDividerModule } from '@angular/material/divider';
import { modifyCloudinaryUrl } from '../../utils/modifyCloudinaryUrl';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';

// Notification Package
import { Howl } from 'howler';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    MatMenuModule,
    MatListItem,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatListModule,
    MatDividerModule,
    CommonModule,
    DatePipe,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications: Notification[] = [];
  isAdmin: boolean = false;

  notificationTune = new Howl({
    src: ['../../../assets/notification.mp3'],
  });

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin;

    this.notificationService
      .getAllNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ notifications }) => {
          notifications.forEach((notification) => {
            if (notification.hasOwnProperty('avatar')) {
              notification.avatar = modifyCloudinaryUrl(
                notification.avatar!,
                40,
                40
              );
            }
          });

          this.notifications = notifications;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit(): void {

    this.notificationService
      .getNewOrderNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notification) => {
          this.notifications.unshift(notification);
          this.notificationTune.play();
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

  get notificaionCount() {
    return this.notifications.length;
  }

  onMarkAllNotificationsAsRead() {
    this.notificationService
      .markAllNotificationsAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications = [];
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onNotificationItem(orderId: string) {}
}
