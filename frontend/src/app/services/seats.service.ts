import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Seats } from './seats.model';
import { API_CONFIG } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class SeatService{
    private baseUrl =`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEATS}`;

    private seatSubject = new BehaviorSubject<Seats[]>([]);
    seat$ = this.seatSubject.asObservable();

    constructor(private http: HttpClient){}
    loadSeats(showtimeId: number) {
        this.http.get<{ result: any[] }>(`${this.baseUrl}/getSeats/${showtimeId}`)
          .pipe(
            tap(res => {
              const mappedSeats = res.result.map(seat => ({
                seat_id: seat.seat_id, // Map ID from DB
                screenName: seat.screen_name,
                seatType: seat.seat_type,
                seatName: seat.seat_number,
                seatPrice: Number(seat.price), // Map Price from DB
                seatStatus: seat.status
              }));
              this.seatSubject.next(mappedSeats);
            })
          ).subscribe();
      }
}