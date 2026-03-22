import { Component } from '@angular/core';
import { MovieData } from '../movie-dialog/movie-data.model';
import { MovieStoreService } from '../../services/movie.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { theaterService } from '../../services/theater.service';
import { theaterData } from '../../services/theater.model';
import { FormsModule } from '@angular/forms';
import { ShowtimePayload } from './showtime.model';
import { ShowtimeInput } from './showtimeinput.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-showtimes',
  imports: [DatePipe,
    FormsModule,
    CommonModule],
  templateUrl: './showtimes.component.html',
  styleUrl: './showtimes.component.scss'
})
export class ShowtimesComponent {


showtimeData: {
  [movieId: number]: { [theaterId: number]: ShowtimeInput[] }
} = {};

constructor(
    private movieStore: MovieStoreService,
    private snackBar: MatSnackBar,
    private theaterStore: theaterService,
    private router: Router
  ) {}

  theaters: theaterData[] = [];
  movies: MovieData[] = [];

  selectedMovieId: number | null = null;   // <— NEW

ngOnInit() {
  this.movieStore.loadMovies();
  this.movies = this.movieStore.movies(); // ✅ read signal value

    this.movieStore.loadMovies();

    // Load theaters
    this.theaterStore.theaters$.subscribe(t => {
      this.theaters = t;
    });
    this.theaterStore.loadTheaters();
    
  }

trackByMovie(index: number, movie: any) {
  return movie.movie_id;
}

trackByTheater(index: number, theater: any) {
  return theater.theater_id;
}

goToAddShowtime(movieId: number) {
  this.router.navigate(['/admin/add-showtimes', movieId]);
}






}
