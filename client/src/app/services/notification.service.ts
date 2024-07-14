import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Socket } from 'ngx-socket-io';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_URL } from '../utils/constants';

export interface UserIdAndRole {
  userId: string;
  role: string;
}

interface SendNotificationResposne {
  status: string;
  msg: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
}

export interface Notification {
  createdAt: Date;
  username?: string;
  avatar?: string;
  orderId: string;
  userId: string;
  type: 'CS' | 'NO';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy{
  constructor(
    private socket: Socket,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.connect();
  }

  connect() {
    this.socket.connect()

    this.socket
      .timeout(5000)
      .emit('registerUser', this.authService.userIdAndRole);
  }

  ngOnDestroy(): void {
    this.socket.disconnect()
  }

  getNewOrderNotification(): Observable<Notification> {
    return this.socket
      .fromEvent<Notification>('newNotification')
      .pipe(catchError(this.handleError));
  }

  emitNewOrderNotificationEvent(orderId: string) {
    const { userId } = this.authService.userIdAndRole;

    this.socket
      .timeout(5000)
      .emit(
        'newOrder',
        { userId, orderId },
        (response: SendNotificationResposne) => {
          console.log(response);
        }
      );
  }

  emitChangeOrderStatusNotificationEvent(orderId: string, userId: string) {
    const { role } = this.authService.userIdAndRole;

    this.socket
      .timeout(5000)
      .emit(
        'changeOrderStatus',
        { userId, role, orderId },
        (response: SendNotificationResposne) => {
          console.log(response);
        }
      );
  }

  getAllNotification(): Observable<NotificationResponse> {
    let url = BASE_URL;
    if (this.authService.isAdmin) {
      url += '/get-unread-admin-notifications';
    } else {
      url += '/get-unread-user-notifications';
    }

    return this.http
      .get<NotificationResponse>(url, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  markAllNotificationsAsRead() {
    let url = BASE_URL;
    if (this.authService.isAdmin) {
      url += '/mark-all-as-read-admin-notifications';
    } else {
      url += '/mark-all-as-read-user-notifications';
    }

    return this.http.patch(url, null, { withCredentials: true });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => error);
  }
}
