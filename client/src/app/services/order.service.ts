import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../utils/constants';
import { Book } from '../components/book-store/book-store.component';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

interface ShippingAddress {
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  state: string | null;
}

interface OrderItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  date: string;
  user: User;
}

interface User {
  username: string;
  email: string;
  avatar: string;
}

interface OrderResponse {
  orders: Order[];
  hasNextPage: boolean;
}

interface ChangeOrderStatusResponse {
  sucess: boolean;
  order: {
    _id: string;
    user: string;
    status: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createOrder(session_id: string) {
    return this.http.post<Order>(
      `${BASE_URL}/create-order`,
      { session_id },
      {
        withCredentials: true,
      }
    );
  }

  getAllOrders(pageNumber: number = 1, status: string, order: string) {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('status', status)
      .set('order', order);

    let endPoint = 'get-user-orders';
    if (this.authService.isAdmin) {
      endPoint = 'get-all-orders';
    }
    return this.http.get<OrderResponse>(`${BASE_URL}/${endPoint}`, {
      params,
      withCredentials: true,
    });
  }

  changeOrderStatus(
    orderId: string,
    status: string
  ): Observable<ChangeOrderStatusResponse> {
    return this.http.patch<ChangeOrderStatusResponse>(
      `${BASE_URL}/update-order-staus`,
      {
        orderId,
        status,
      },
      {
        withCredentials: true,
      }
    );
  }
}
