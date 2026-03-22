import { Routes } from '@angular/router';
import { LoginCardComponent } from './login-card/login-card.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AdminHomeComponent } from './admin/home/admin-home.component';
import { NewMovieComponent } from './admin/new/new-movie.component';
import { ManageMovieComponent } from './admin/manage-movie/manage-movie.component';
import { ApprovalComponent } from './admin/approval/approval.component';
import { TheatresComponent } from './admin/theaters/theaters.component';
import { ShowtimesComponent } from './admin/showtimes/showtimes.component';
import { ManageShowtimeComponent } from './admin/manage-showtime/manage-showtime.component';
import { AddShowtimeComponent } from './admin/add-showtime/add-showtime.component';
import { MovieDetailsComponent } from './home/movie-details/movie-details.component';
import { ViewShowtimesComponent } from './home/view-showtimes/view-showtimes.component';
import { ViewSeatsComponent } from './home/view-seats/view-seats.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},

  {path: 'user',
  children: [
    {path: 'movie-details/:movieId', component: MovieDetailsComponent},
    {path: 'movie/:movieId',
      children: [
        {path: 'showtimes', component: ViewShowtimesComponent},
        {path: 'showtimes/:showtimeId/seats', component: ViewSeatsComponent}
      ]
    }
  ]
},
  { path: 'login', component: LoginCardComponent },
  { path: 'signup', component: SignUpComponent },

  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: 'new-movie', component: NewMovieComponent },
      { path: 'manage-movie', component: ManageMovieComponent },
      {path: 'approval', component: ApprovalComponent},
      {path: 'theatres', component: TheatresComponent},
      {path: 'add-showtimes', component: ShowtimesComponent},
      {path: 'manage-showtimes', component: ManageShowtimeComponent},
    {path: 'add-showtimes/:movieId', component: AddShowtimeComponent}
    ],
  },
];
