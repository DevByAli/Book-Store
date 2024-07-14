import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Login } from '../components/login/login.component';
import { BASE_URL } from '../utils/constants';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface AuthResponse {
  sucess: boolean;
  msg: string;
  token: string;
}

export interface AuthToken {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  cloudinaryId: string;
}

interface RefreshTokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (this.token) {
      const { role } = jwtDecode(this.token) as JwtPayload as AuthToken;
      if (role === 'admin') {
        this.isAdminSubject.next(true);
      }
    }
  }

  login(data: Login): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${BASE_URL}/login`, data, {
        withCredentials: true,
      })
      .pipe(
        tap(({ token }: AuthResponse) => {
          this.token = token;

          const { role } = jwtDecode(token) as JwtPayload as AuthToken;

          console.log('role', role);
          if (role === 'admin') {
            this.isAdminSubject.next(true);
          }
        })
      );
  }

  logout() {
    return this.http.get(`${BASE_URL}/logout`, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.isAdminSubject.next(false);
      })
    );
  }

  refreshToken() {
    return this.http.get<RefreshTokenResponse>(`${BASE_URL}/refresh-token`, {
      withCredentials: true,
    });
  }

  private get tokenFromCookie(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const name = 'refreshToken=';
    const decodedCookie = decodeURIComponent(document.cookie);

    if (!decodedCookie) return null;

    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  private isTokenExpired(): boolean {
    try {
      const decoded: any = jwtDecode(this.token!);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token', error);
      return true; // Treat as expired if there's an error
    }
  }

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLogin() {
    if (!this.tokenFromCookie || !this.token) {
      return false;
    }

    if (this.isTokenExpired()) {
      this.refreshToken().subscribe({
        next: ({ token }: RefreshTokenResponse) => (this.token = token),
        error: (error) => {
          console.log(error);
          this.router.navigate(['/login']);
        },
      });
    }

    return true;
  }

  get isAdmin(): boolean {
    const { role } = jwtDecode(this.token!) as JwtPayload as AuthToken;

    if (role === 'admin') {
      return true;
    }
    return false;
  }

  get userIdAndRole() {
    const { _id, role } = jwtDecode(this.token!) as JwtPayload as AuthToken;
    return { userId: _id, role };
  }
}
