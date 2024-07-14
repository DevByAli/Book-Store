import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../utils/constants';

interface UpdateProfileInfoResponse {
  msg: string;
  user: { username: string; email: string };
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfileInfo(): Observable<any> {
    return this.http.get(`${BASE_URL}/get-user-profile-info`, {
      withCredentials: true,
    });
  }

  updateProfileInfo(data: UpdateProfileInfoResponse): Observable<any> {
    return this.http.patch(`${BASE_URL}/update-user-profile-info`, data, {
      withCredentials: true,
    });
  }

  uploadProfileImage(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${BASE_URL}/upload-avatar`, formData, {
      withCredentials: true,
      reportProgress: true,
      responseType: 'json',
      observe: 'events',
    });
  }

  deleteProfileImage() {
    return this.http.delete(`${BASE_URL}/delete-avatar`, {
      withCredentials: true,
    });
  }
}
