import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { MovieStoreService } from '../../services/movie.service';
import { theaterService } from '../../services/theater.service';
import { ShowService } from '../../services/show.service';
import { FormsModule } from '@angular/forms';
import { SeatTypeConfig, ShowTime } from '../../services/showTime.model';
import { ShowTimeService } from '../../services/ShowTime.service';
@Component({
  selector: 'app-add-showtime',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './add-showtime.component.html',
  styleUrl: './add-showtime.component.scss'
})
export class AddShowtimeComponent implements OnInit {


  private route = inject(ActivatedRoute);
  private movieStore = inject(MovieStoreService);
  private theaterService = inject(theaterService);
  private showService = inject(ShowService);
  private showTimeService = inject(ShowTimeService);


  movieId = signal<number | null>(null);

  theaters = signal<any[]>([]);
  screens = signal<any[]>([]);

  selectedTheaterId = signal<number | null>(null);
  selectedScreenId = signal<number | null>(null);

  selectedMovie = this.movieStore.selectedMovie;
  loading = this.movieStore.loading;
  error = this.movieStore.error;

  seatConfigs: SeatTypeConfig[] = [
    {seatType: null, totalSeats: 0, price: 0}
  ]

  addSeatRow(){
    this.seatConfigs.push({seatType: null, totalSeats: 0, price: 0})
  }

  removeSeatRow(index: number){
    this.seatConfigs.splice(index, 1);
  }

  ngOnInit(): void {

    this.theaterService.loadTheaters();

    this.theaterService.theaters$.subscribe({
      next: theaters => this.theaters.set(theaters),
      error: () => console.error('Failed to load theaters')
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('movieId');
      if (id) {
        this.movieId.set(+id);
        this.movieStore.loadMovieById(+id);
      }
    });

    
  }

onTheaterChange(theaterId: string) {
  const id = Number(theaterId);

  if (!id || isNaN(id)) {
    this.selectedTheaterId.set(null);
    this.selectedScreenId.set(null);
    this.screens.set([]);
    return;
  }

  this.selectedTheaterId.set(id);
  this.selectedScreenId.set(null);
  this.screens.set([]);

  this.showService.getScreens(id).subscribe({
    next: screens => {
      this.screens.set(screens); // populate screens signal
      if (screens.length > 0 && screens[0].screen_id != null){
        this.selectedScreenId.set(Number(screens[0].screen_id));
      }
    },
    error: () => {
      this.screens.set([]);
      console.error('Failed to load screens');
    }
  });
}

setScreen(event: Event){
  const select = event.target as HTMLSelectElement;
  this.selectedScreenId.set(Number(select.value));
}


onScreenChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  
  if(!value || value == '' || value === 'null'){
    this.selectedScreenId.set(null);
    console.log('Screen ID set to null');
    return;
  }

  const id = Number(value);
  this.selectedScreenId.set(isNaN(id) ? null : id);
}

submitShowtTime(
  dateInput: HTMLInputElement,
  startInput: HTMLInputElement,
  endInput: HTMLInputElement
){

  if(!this.movieId() || !this.selectedScreenId()){
    alert('Please select movie and screen');
    console.log('movieId',this.movieId());
    console.log('screen id:', this.selectedScreenId());
    return;
  }

  if (!dateInput.value || !startInput.value || !endInput.value){
    alert('Please fill all fields');
    return;
  }

  const showtime: ShowTime = {
    movieId: this.movieId()!,
    screenId: this.selectedScreenId()!,
    startTime: `${dateInput.value} ${startInput.value}`,
    endTime: `${dateInput.value} ${endInput.value}`,
    seatTypes: this.seatConfigs
  }

  const types = this.seatConfigs.map(s=> s.seatType);
  if (new Set(types).size !== types.length){
    alert("Duplicate seat types not allowed");
    return;
  }

  if(this.seatConfigs.some(s=> !s.seatType || !s.totalSeats || !s.price)){
    alert('Please fill all seat configurations');
    return;
  }
  
  this.showTimeService.addShowTime(showtime).subscribe({
    next: () => alert('Showtime added succesfully'),
    error: () => alert('Failed to add showtime')
  })

  

}

}
