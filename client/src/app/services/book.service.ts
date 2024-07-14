import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../utils/constants';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../components/book-store/book-store.component';
import { TagService } from './tag.service';

interface BookData {
  title: String;
  author: String;
  price: Number;
  tags: Array<String>;
  description: String;
  url: String;
  cloudinaryId: String;
}

export interface Books {
  success: boolean;
  books: Book[];
  totalPages: number;
  hasNextPage: boolean;
}

export interface BookDetails {
  book: Book;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient, private tagService: TagService) {}

  uploadImage(file: File): Observable<HttpEvent<any>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);

    return this.http
      .post(`${BASE_URL}/upload-cover`, formdata, {
        withCredentials: true,
        reportProgress: true,
        responseType: 'json',
        observe: 'events',
      })
      .pipe(catchError(this.handleError));
  }

  uploadBook(book: BookData) {
    return this.http
      .post(`${BASE_URL}/add-book`, book, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getBook(bookId: string) {
    return this.http
      .get<BookDetails>(`${BASE_URL}/get-book/${bookId}`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getBooks(
    pageNumber: number = 1,
    filter: string = '',
    order: string = ''
  ): Observable<Books> {
    let params = new HttpParams().set('pageNumber', pageNumber.toString());

    if (filter && order) {
      params = params.set(filter, order);
    } else if (filter && !order) {
      params = params.set(filter, 1);
    }

    return this.http
      .get<Books>(`${BASE_URL}/get-books`, { params })
      .pipe(catchError(this.handleError));
  }

  getBookTags() {
    return this.tagService.getTags().pipe(catchError(this.handleError));
  }

  updateBook(bookId: string, bookData: Book) {
    return this.http.patch(`${BASE_URL}/update-book/${bookId}`, bookData, {
      withCredentials: true,
    });
  }

  searchBooks(
    query: string,
    deepSearch: boolean = false,
    pageNumber: number = 1,
    filter: string = '',
    order: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('deepSearch', deepSearch.toString())
      .set('pageNumber', pageNumber.toString());

    if (filter && order) {
      params = params.set(filter, order);
    } else if (filter && !order) {
      params = params.set(filter, 1);
    }

    return this.http
      .get<Books>(`${BASE_URL}/search-book`, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => error);
  }
}
