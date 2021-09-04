import { Component, OnInit } from '@angular/core';
import { ApiShortenService } from '../services/api-shorten.service';
import { dbObj } from '../interfaces/databaseObj';

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css'],
})
export class UrlShortenerComponent implements OnInit {
  constructor(private apiShortenService: ApiShortenService) {}

  ngOnInit(): void {}

  originalUrl: string = '';
  shortenedUrl: string = '';

  submitUrl(submittedUrl: string) {
    console.log(submittedUrl);

    this.apiShortenService.getShortenedLink(submittedUrl).subscribe((data) => {
      console.log(data);
      this.shortenedUrl = data.shortenedUrl;
    });
  }
}
