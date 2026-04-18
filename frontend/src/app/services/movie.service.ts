import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieData } from '../admin/movie-dialog/movie-data.model';
import { API_CONFIG } from '../constants/constants';
@Injectable({ providedIn: 'root' })
export class MovieStoreService {

  private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVIES}`;
  movies = signal<MovieData[]>([]);
  selectedMovie = signal<MovieData | null>(null);
  error = signal<string | null>(null);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  loadMovies() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<{ result: MovieData[] }>(`${this.baseUrl}/getMovie`)
      .subscribe({
        next: (res) => {
          this.movies.set(res.result);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Failed to load movies');
        }
      });
  }

  loadMovieById(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<{ result: MovieData }>(
      `${this.baseUrl}/getMovie/${id}`
    ).subscribe({
      next: (res) => {
        this.selectedMovie.set(res.result);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.selectedMovie.set(null);
        this.error.set(err.error?.message || 'Movie is inactive');
      }
    });
  }

  removeMovie(movieId: number) {
    return this.http.delete(
      `${this.baseUrl}/deleteMovie/${movieId}`
    );
  }
}
