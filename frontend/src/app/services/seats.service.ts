import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Seats } from './seats.model';

@Injectable({ providedIn: 'root' })
export class SeatService{
    private baseUrl = "http://localhost:3000/seats"

    private seatSubject = new BehaviorSubject<Seats[]>([]);
    seat$ = this.seatSubject.asObservable();

    constructor(private http: HttpClient){}
    loadSeats(showtimeId: number){
        this.http.get<{result:any[]}>(`${this.baseUrl}/getSeats/${showtimeId}`)
        .pipe(
            tap(res=>{
                console.log('API Response', res);

                const seats = res.result.map(seat=>({
                    screenName: seat.screen_name,
                    seatType: seat.seat_type,
                    seatName: seat.seat_number,
                    seatPrice: seat.seat_price,
                    seatStatus: seat.status
                }));
                this.seatSubject.next(seats);
            })
            
        )
        .subscribe();
    }
}