import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ActivatedRoute } from '@angular/router';
import { MovieStoreService } from '../../services/movie.service';
import { ShowTimeService } from '../../services/ShowTime.service';
import { SeatService } from '../../services/seats.service';
import { Seats } from '../../services/seats.model';

@Component({
  selector: 'app-view-seats',
  imports: [HeaderComponent],
  templateUrl: './view-seats.component.html',
  styleUrl: './view-seats.component.scss'
})
export class ViewSeatsComponent {
  private route = inject(ActivatedRoute);
  private movieStore = inject(MovieStoreService);
  private showTimeService = inject(ShowTimeService);
  private seatService = inject(SeatService);

  movieId = signal<number|null>(null);
  selectedDate = signal<Date>(new Date());
  showtimes = signal<any[]>([]);
  showtimeId = signal<number |null>(null);
  seatSelected = false;

  seats: Seats[] = []
  regularSeats : Seats[] = []
  premiumSeats : Seats[] = []
  vipSeats : Seats[] = []

  selectedMovie = this.movieStore.selectedMovie;
  loading = this.movieStore.loading;
  error = this.movieStore.error;

  selectedSeats: Set<string> = new Set();

  toggleSeat(seatName: string) {
    if (this.selectedSeats.has(seatName)) {
      this.selectedSeats.delete(seatName);
    } else {
      this.selectedSeats.add(seatName);
    }
  }

  ngOnInit(){
    const id = this.movieId();

    this.route.paramMap.subscribe(params => {
      const id = params.get('showtimeId');
      if(id){
        const showtimeId = +id;
        this.showtimeId.set(showtimeId);
        this.seatService.loadSeats(showtimeId);
      }
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('movieId');
      if(id){
        const movieId = +id;
        this.movieId.set(movieId);
        this.movieStore.loadMovieById(movieId);
      }
    });

    this.seatService.seat$.subscribe(seats =>{
      this.seats = seats;
      this.regularSeats = this.seats.filter(seat=> seat.seatType === "REGULAR")
      this.premiumSeats = this.seats.filter(seat=> seat.seatType === "PREMIUM")
      this.vipSeats= this.seats.filter(seat=> seat.seatType === "VIP")

    })
  }
}
