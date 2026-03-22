import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { MovieStoreService } from '../services/movie.service';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private movieStore = inject(MovieStoreService);
  movies = this.movieStore.movies;
  constructor(private fb: NonNullableFormBuilder, private router : Router){}

  myGroup!: FormGroup<{
    selectedDate: FormControl<Date>;
  }>

  ngOnInit(){
    this.movieStore.loadMovies();
    const defaultDate = new Date();
    this.myGroup = this.fb.group({
      selectedDate: new Date()
    })
  }

  gotoMovieDetails(movieId: number){
    this.router.navigate(['user/movie-details', movieId]);
  }
}
