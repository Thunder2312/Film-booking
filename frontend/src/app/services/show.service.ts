import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class ShowService {
  private baseUrl = API_CONFIG.BASE_URL;

  constructor(private http: HttpClient) {}

  getTheaters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/theaters`);
  }

  getScreens(theaterId: number): Observable<any[]> {
    return this.http
      .get<{ result: any[] }>(`${this.baseUrl}/screens/getScreens/${theaterId}`)
      .pipe(map(res => res.result));
  }
}
