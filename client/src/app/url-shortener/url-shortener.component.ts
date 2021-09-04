import { Component, OnInit } from '@angular/core';
import { ApiShortenService } from '../services/api-shorten.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css'],
})
export class UrlShortenerComponent implements OnInit {
  constructor(
    private apiShortenService: ApiShortenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  originalUrl: string = '';
  shortenedUrl: string = '';

  errorMessage = '';

  submitUrl(submittedUrl: string) {
    console.log(submittedUrl);

    this.apiShortenService.getShortenedLink(submittedUrl).subscribe((data) => {
      console.log(data);
      if (data.hasOwnProperty('error')) {
        this.errorMessage = data.error!;
        this.shortenedUrl = '';
      } else {
        this.shortenedUrl = data.shortenedUrl!;
        this.errorMessage = '';
      }
    });
  }

  openSnackBar() {
    this.snackBar.open('Link copied!', 'Close', {
      duration: 3000,
    });
  }
}
