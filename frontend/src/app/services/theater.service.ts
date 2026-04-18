import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { theaterData } from './theater.model';
import { ShowTime } from './showTime.model';
import { API_CONFIG } from '../constants/constants';
@Injectable({
  providedIn: 'root'
})
export class theaterService {

  private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THEATERS}`;
  // BehaviorSubject holds the current theater list
  private theaterSubject = new BehaviorSubject<theaterData[]>([]);
  theaters$ = this.theaterSubject.asObservable(); // components subscribe here

  constructor(private http: HttpClient) {}

  loadTheaters(): void {
    this.http.get<{ result: any[] }>(`${this.baseUrl}/getTheater`)
      .pipe(
        tap(res => {
          // Ensure 'result' exists before mapping to prevent crashes
          if (res && res.result) {
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
            this.theaterSubject.next(theaters);
          }
        })
      )
      .subscribe({
        error: (err) => console.error('Failed to load theaters from API', err)
      });
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
}
