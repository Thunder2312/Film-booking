import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { theaterData } from '../../services/theater.model';
import { theaterService } from '../../services/theater.service';
@Component({
  selector: 'app-theater-dialog',
  imports: [FormsModule],
  templateUrl: './theater-dialog.component.html',
  styleUrl: './theater-dialog.component.scss'
})
export class TheaterDialogComponent {
TheaterData = {
  name: '',
  location: '',
  total_screens: 0,
  city: ''
}

  showForm: boolean = true;

  

  constructor(private http: HttpClient, private theaterStore: theaterService ,
    private dialogRef: MatDialogRef<TheaterDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
  if (data) {
    this.TheaterData = {
      name: data.name,
      location: data.location,
      total_screens: data.total_screens,
      city: data.city
    };
  }
}

  

  onsubmit() {
  this.theaterStore.addTheater(this.TheaterData).subscribe({
    next: () => {
      console.log('Theater added successfully.');
      this.dialogRef.close(true);  // notify parent

      // Reset form
      this.showForm = false;
      this.TheaterData = {
        name: '',
        location: '',
        total_screens: 0,
        city: ''
      };
    },
    error: (err) => {
      console.error('Error adding theater:', err);
    }
  });
}

}
