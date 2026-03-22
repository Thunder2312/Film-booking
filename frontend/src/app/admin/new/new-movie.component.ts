import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { environment } from '../../../environments/environments';
@Component({
  selector: 'app-new-movie',
  templateUrl: './new-movie.component.html',
  styleUrls: ['./new-movie.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, MatDialogModule, MovieDialogComponent ]
})
export class NewMovieComponent {
  search_text = '';
  movieDetails: any = null; // single movie
  apiKey = environment.apiKey;
  constructor(private http: HttpClient, private dialog: MatDialog) {}
  


  onSearch() {
    const title = this.search_text.trim();
    if (!title) return;

    this.http
      .get<any>(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${this.apiKey}&type=movie`)
      .subscribe((data) => {
        if (data && data.Response !== 'False') {
          const ids = data.Search.map((movie:any)=> movie.imdbID); //map ids to variable from multiple titles
          
          const requests = ids.map((id: any) => this.http.get(`https://www.omdbapi.com/?i=${id}&apikey=${this.apiKey}`));

          forkJoin(requests).subscribe((movies)=>{
            this.movieDetails = movies;
            console.log('Full Movie Details')
          })
        } else {
          this.movieDetails = [];
        }
      });
  }



  movieDialog(){
    this.dialog.open(MovieDialogComponent, {
  width: '80vw',           // relative to viewport
  maxWidth: '900px',       //  keeps it readable on big screens
  height: 'auto',          // let content define height
  maxHeight: '90vh',       // never exceed viewport height
  panelClass: 'movie-dialog-container',  // custom class for styling
  autoFocus: false         // prevents input auto-scroll
});
  }

  knownDialog(movie:any){
    this.dialog.open(MovieDialogComponent, {
  width: '80vw',           // relative to viewport
  maxWidth: '900px',       //  keeps it readable on big screens
  height: 'auto',          // let content define height
  maxHeight: '90vh',       // never exceed viewport height
  panelClass: 'movie-dialog-container',  // custom class for styling
  autoFocus: false , // prevents input auto-scroll
  data: movie        
});
  }
}
