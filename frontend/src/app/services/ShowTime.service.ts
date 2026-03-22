import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { MovieData  } from '../admin/movie-dialog/movie-data.model';
import { ShowTime } from './showTime.model';
import { C } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})


export class ShowTimeService{
  constructor(private http: HttpClient){}

    private baseUrl = 'http://localhost:3000/showtimes';

    addShowTime(showtime: ShowTime){
      const payload = {
        movie_id: showtime.movieId,
        screen_id: showtime.screenId,
        start_time: showtime.startTime,
        end_time: showtime.endTime,
        seatTypes: showtime.seatTypes || []
      }

      return this.http.post(`${this.baseUrl}/addShowTimes/`,payload);
    }

    loadScheduleShowTimes(startDate: string, endDate: string){
      return this.http
      .get<any[]>(`${this.baseUrl}/getDayShowTimes?startDate=${startDate}&endDate=${endDate}`)
      .pipe(
        map(
          res=>{
            const theaterMap = new Map();

            res.forEach(item => {
              const theaterKey = item.theater_id;

              if (!theaterMap.has(theaterKey)){
                theaterMap.set(theaterKey,{
                  theater_id: item.theater_id,
                  theater_name: item.theater_name,
                  theater_location: item.theater_location,
                  screens: []
                })
              }

              const theater = theaterMap.get(theaterKey);

              theater.screens.push({
                screen_id: item.screen_id,
                screen_name: item.screen_name,
                showtime: item.showtimes.map((st: any)=>({
                  showtime_id: st.showtime_id,
                  movie_name: st.movie_name,
                  start_time: new Date(st.start_time),
                  end_time: new Date(st.end_time)
                }))
              })
            })
          }
        )
      )
    }

    loadShowTimes(movieId: number, startDate: string, endDate: string){
      return this.http
      .get<any[]>(`${this.baseUrl}/getMovieShowTimes/${movieId}?startDate=${startDate}&endDate=${endDate}`)
      .pipe(
        map(res=>
          res.sort((a,b) => a.theater_name.localeCompare(b.theater_name))
          .map(theater=>({
            theater_name: theater.theater_name,
            theater_location: theater.theater_location,
            showtimes: theater.showtimes
            .sort(
              (a: any,b:any)=>
              new Date(a.start_time).getTime() -
              new Date(b.start_time).getTime()
            )
            .map((st:any)=>({
              ...st,
              start_time: new Date(st.start_time)
              .toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
              .toLowerCase(),
              end_time: new Date(st.end_time)
              .toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
              .toLowerCase(),
              showtime_id : st.showtime_id
            }))
          })))
      )
    }
}
