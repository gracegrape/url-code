import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { dbObj } from '../interfaces/databaseObj';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiShortenService {
  constructor(private http: HttpClient) {}

  private API_URL = environment.API_URL;

  getAllFromDB() {
    let apiUrl = this.API_URL + '/getUrlDatas';
    return this.http.get(apiUrl).pipe(
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }

  getShortenedLink(originalUrl: string) {
    let apiUrl = this.API_URL + '/urlShorten';

    const urlToSend = {
      url: originalUrl,
    };

    return this.http.post<dbObj>(apiUrl, urlToSend).pipe(
      catchError((error) => {
        console.log(error);
        if (error.status == 0) {
          const errorDB: dbObj = {
            error: 'The server seems to be down... Try again later?',
          };
          return of(errorDB);
        } else {
          const errorDB: dbObj = {
            error: error.error.message,
          };
          return of(errorDB);
        }
      })
    );
  }
}
