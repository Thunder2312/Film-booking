import { Component, ElementRef, HostListener, ViewChild, effect, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MovieStoreService } from '../../services/movie.service';
import { ShowTimeService } from '../../services/ShowTime.service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-movie-details',
  imports: [HeaderComponent, 
    DatePipe,
  CommonModule,
  ReactiveFormsModule,
MatFormFieldModule,
RouterOutlet,
MatDatepickerModule,
],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
  providers: [provideNativeDateAdapter(), 
  {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class MovieDetailsComponent {

  private route = inject(ActivatedRoute);
  private movieStore = inject(MovieStoreService);
  private showTimeService = inject(ShowTimeService);
  private fb = inject(NonNullableFormBuilder);

  isStickyVisible = false;

  @ViewChild('movieCard') movieCard! : ElementRef;

  @HostListener('window:scroll', [])
  onWindowScroll(){
    if(this.movieCard){
      const rect = this.movieCard.nativeElement.getBoundingClientRect();

      this.isStickyVisible = rect.bottom <= 0;
    }
  }

  
  movieId = signal<number| null>(null);
  selectedDate = signal<Date>(new Date());
  showtimes = signal<any[]>([]);

  showtimeId = signal<number| null>(null);

  selectedMovie = this.movieStore.selectedMovie;
  loading = this.movieStore.loading;
  error = this.movieStore.error;


  myGroup = this.fb.group({
    selectedDate: this.fb.control(this.selectedDate())
  })


minutesToHoursMinutes(totalMinutes?: number): string {
  if(totalMinutes == null) return '';

  const hours = Math.floor(totalMinutes/60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2,'0')}m`
}

constructor(private router: Router){

  this.route.paramMap.subscribe(params => {
    const id = params.get('movieId');
    if (id) {
      const movieId = +id;
      this.movieId.set(movieId);
      this.movieStore.loadMovieById(movieId);
    }
  });

  this.myGroup.controls.selectedDate.valueChanges.subscribe(date =>{
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(0,0,0,0);
      this.selectedDate.set(newDate);
    }
  });

  effect(()=>{
    const id = this.movieId();
    const date = this.selectedDate();

    if(!id || !date) return;

    const formattedDate = date.toLocaleDateString('en-IN');
  });
}
goToView(movieId: number | undefined){
  this.router.navigate(['/user/movie', movieId, 'showtimes']);
}
}
