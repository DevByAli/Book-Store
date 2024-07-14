import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../components/register/register.component';
import { BASE_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(data: Register): Observable<any> {
    return this.http.post(`${BASE_URL}/register-user`, data, {
      withCredentials: true,
    });
  }

  verify(activationCode: string) {
    return this.http.post(
      `${BASE_URL}/activate-user`,
      {
        activationCode,
      },
      {
        withCredentials: true,
      }
    );
  }
}
