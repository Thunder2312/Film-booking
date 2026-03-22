import { Component, OnInit, inject } from '@angular/core';
import { MovieStoreService } from '../../services/movie.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage-movie',
  imports: [FormsModule, CommonModule, RouterOutlet, MatSnackBarModule],
  templateUrl: './manage-movie.component.html',
  styleUrl: './manage-movie.component.scss'
})
export class ManageMovieComponent implements OnInit {

  private movieStore = inject(MovieStoreService);
  private snackBar = inject(MatSnackBar);

  movies = this.movieStore.movies;

  ngOnInit() {
    this.movieStore.loadMovies();
  }

  removeMovie(id: number) {
    this.movieStore.removeMovie(id).subscribe({
      next: () => {
        this.snackBar.open('Movie removed successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
        this.movieStore.loadMovies();
      },
      error: () => {
        this.snackBar.open('Failed to remove movie.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    });
  }
}
