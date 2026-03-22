import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { theaterData } from './theater.model';
import { ShowTime } from './showTime.model';
@Injectable({
  providedIn: 'root'
})
export class theaterService {

  private baseUrl = 'http://localhost:3000/theaters';

  // BehaviorSubject holds the current theater list
  private theaterSubject = new BehaviorSubject<theaterData[]>([]);
  theaters$ = this.theaterSubject.asObservable(); // components subscribe here

  constructor(private http: HttpClient) {}

  // Load theaters from server and update the subject
  loadTheaters() {
    this.http.get<{ result: any[] }>(`${this.baseUrl}/getTheater`)
      .pipe(
        tap(res => {
          console.log('API response:', res);  
          const theaters = res.result.map(theater => ({
            theater_id: theater.theater_id,
            name: theater.name,
            location: theater.location,
            total_screens: theater.total_screens,
            city: theater.city,
            showtimeStart: 0,
            showtimeEnd: 0,
            showtimePrice: 0
          }));
         this.theaterSubject.next(theaters); // ✅ update subject 
        })
      )
      .subscribe();
  }

  addTheater(data: any) {
  return this.http.post(`${this.baseUrl}/addTheater`, data).pipe(
    tap(() => this.loadTheaters())  // reload from API
  );
}

// Remove theater and update subject
removeTheater(theater_id: number) {
  return this.http.delete(`${this.baseUrl}/removeTheater`, {
    body: { theater_id }
  }).pipe(
    tap(() => {
      const updated = this.theaterSubject.value
        .filter(t => t.theater_id !== theater_id);

      this.theaterSubject.next(updated);
    })
  );
}


  
  // Add a showtime for a theater
  addShowtime(showtime: ShowTime): Observable<any> {
    return this.http.post('/api/showtimes', showtime);
  }

  // Add multiple showtimes at once
  addMultipleShowtimes(showtimes: ShowTime[]): Observable<any> {
    return this.http.post('/api/showtimes/bulk', showtimes);
  }
}
