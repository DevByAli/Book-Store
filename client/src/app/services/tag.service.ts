import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../utils/constants';
import { Observable, catchError, throwError } from 'rxjs';

export interface Tag {
  _id: string;
  tag: string;
}

export interface Tags {
  tags: Tag[];
}

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  getTags() {
    return this.http
      .get<Tags>(`${BASE_URL}/get-tags`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  addTag(tag: string) {
    return this.http
      .post<Tag>(
        `${BASE_URL}/add-tag`,
        { tag },
        {
          withCredentials: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteTag(tagId: string) {
    return this.http
      .delete(`${BASE_URL}/delete-tag/${tagId}`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  updateTag(tagId: string, tag: string) {
    return this.http
      .patch(
        `${BASE_URL}/update-tag`,
        { tagId, tag },
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => error);
  }
}
