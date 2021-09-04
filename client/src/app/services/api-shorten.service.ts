import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { dbObj } from '../interfaces/databaseObj';

@Injectable({
  providedIn: 'root',
})
export class ApiShortenService {
  constructor(private http: HttpClient) {}

  getAllFromDB() {
    let apiUrl = 'http://localhost:3001/getUrlDatas';
    return this.http.get(apiUrl).pipe(
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }

  getShortenedLink(originalUrl: string) {
    let apiUrl = 'http://localhost:3001/urlShorten';

    const urlToSend = {
      url: originalUrl,
    };

    return this.http.post<dbObj>(apiUrl, urlToSend).pipe(
      catchError((error) => {
        const errorDB: dbObj = {
          error: error,
        };

        return of(errorDB);
      })
    );
  }
}
