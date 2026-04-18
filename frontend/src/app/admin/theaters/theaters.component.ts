import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { MovieData } from '../movie-dialog/movie-data.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieStoreService } from '../../services/movie.service';
import { theaterData } from '../../services/theater.model';
import { theaterService } from '../../services/theater.service';
import { TheaterDialogComponent } from '../theater-dialog/theater-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-theatres',
  imports: [FormsModule, CommonModule, RouterOutlet, MatSnackBarModule, MatDialogModule],
  templateUrl: './theaters.component.html',
  styleUrl: './theaters.component.scss'
})
export class TheatresComponent implements OnInit{
constructor(
  private theaterStore: theaterService ,
  private snackBar: MatSnackBar, private dialog: MatDialog
) {}


theaters: theaterData[] = [];

ngOnInit() {
  // Subscribe to movie data (auto-updates)
  this.theaterStore.theaters$.subscribe(theaters => {
    this.theaters = theaters;
  });

  // load once
  this.theaterStore.loadTheaters();
}

removeTheater(id: number) {
  this.theaterStore.removeTheater(id).subscribe({
    next: () => {
      this.snackBar.open('Theater removed successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    },
    error: () => {
      this.snackBar.open('Failed to remove theater.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }
  });
}
 movieDialog(){
    this.dialog.open(TheaterDialogComponent, {
  width: '80vw',           // relative to viewport
  maxWidth: '900px',       //  keeps it readable on big screens
  height: 'auto',          // let content define height
  maxHeight: '90vh',       // never exceed viewport height
  panelClass: 'movie-dialog-container',  // custom class for styling
  autoFocus: false         // prevents input auto-scroll
});
  }

}
