import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../utils/constants';

interface TotalEarning {
  earnings: number;
}

export interface TopCountry {
  country: string;
  totalQuantity: number;
}

interface TopCustomerCountries {
  topCountries: TopCountry[];
}

export interface MostSellingBook {
  bookId: string;
  title: string;
  author: string;
  purchased: number;
  url: string;
}

interface MostSellingBooks {
  mostSellingBooks: MostSellingBook[];
}

export interface MostSellingCategory {
  tag: string;
  totalQuantity: number;
}

interface MostSellingCategories {
  mostSellingTags: MostSellingCategory[];
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private http: HttpClient) {}

  getTotalEarning(period: string) {
    const params = new HttpParams().set('period', period);

    return this.http.get<TotalEarning>(`${BASE_URL}/get-total-earning`, {
      params,
      withCredentials: true,
    });
  }

  getMostSellingBooks() {
    return this.http.get<MostSellingBooks>(`${BASE_URL}/most-selling-books`, {
      withCredentials: true,
    });
  }

  getMostSellingCategory() {
    return this.http.get<MostSellingCategories>(
      `${BASE_URL}/most-selling-books-category`,
      {
        withCredentials: true,
      }
    );
  }

  getTopCountriesByBookSales() {
    return this.http.get<TopCustomerCountries>(
      `${BASE_URL}/most-buying-country`,
      {
        withCredentials: true,
      }
    );
  }
}
