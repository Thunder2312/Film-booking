import { Component, effect, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieStoreService } from '../../services/movie.service';
import { ShowTimeService } from '../../services/ShowTime.service';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-showtimes',
  imports: [HeaderComponent,
    FormsModule,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatFormFieldModule,
    MatDatepickerModule,
    RouterModule],
  templateUrl: './view-showtimes.component.html',
  styleUrl: './view-showtimes.component.scss'
})
export class ViewShowtimesComponent {

  private route = inject(ActivatedRoute);
  private movieStore = inject(MovieStoreService);
  movies = this.movieStore.movies;
  private showTimeService = inject(ShowTimeService);
  private fb = inject(NonNullableFormBuilder);

  movieId = signal<number | null>(null);
  selectedDate = signal<Date>(new Date());
  showtimes = signal<any[]>([]);

  selectedMovie = this.movieStore.selectedMovie;
  loading = this.movieStore.loading;
  error = this.movieStore.error;


  myGroup = this.fb.group({
    selectedDate: this.fb.control(this.selectedDate())
  })

  today = new Date();

  nextSixDays = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(this.today);
    date.setDate(this.today.getDate() + i);
    return date;
  })
  minutesToHoursMinutes(totalMinutes?: number): string {
    if (totalMinutes == null) return '';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  }
  selectDate(date: Date) {
    // Update the signal
    this.selectedDate.set(date);

    // emitEvent: false prevents an infinite loop with your valueChanges subscriber
    this.myGroup.controls.selectedDate.setValue(date, { emitEvent: false });
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  constructor(private router: Router) {

    effect(() => {
      const id = this.movieId();
      const date = this.selectedDate();

      if (!id || !date) return;

      // Standardize your date format
      const formattedDate = date.toLocaleDateString('en-IN');

      // Trigger the API call
      const sub = this.showTimeService
        .loadShowTimes(id, formattedDate, formattedDate)
        .subscribe(showtimes => this.showtimes.set(showtimes));
    })


    this.myGroup.controls.selectedDate.valueChanges.subscribe(date => {
      if (date) {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        this.selectedDate.set(newDate);
      }
    })

    this.route.paramMap.subscribe(params => {
      const id = params.get('movieId');
      if (id) {
        const movieId = +id;
        this.movieId.set(movieId);
        this.movieStore.loadMovieById(movieId);
      }
    })

  }

  gotoMovieDetails(movieId?: number) {
    this.router.navigate(['/user/movie-details', movieId])
  }

  gotoSeats(showtimeId: number, movieId?: number) {
    this.router.navigate(['/user/movie', movieId, 'showtimes', showtimeId, 'seats']);
  }
}
