import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-movie',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class MovieDialogComponent {

  movieForm: FormGroup;
  showForm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<MovieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    // Initialize Reactive Form
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      year:  ['', Validators.required],
      description: ['', Validators.required],
      duration_minutes: [0, Validators.required],
      genre: ['', Validators.required],
      language: ['', Validators.required],
      writers: ['', Validators.required],
      actors: ['', Validators.required],
      rated: ['', Validators.required],
      img_link: ['', Validators.required],
      country: ['', Validators.required],
      release_date: ['', Validators.required]
    });

    // Using this for putting data
    if (data) {
      this.movieForm.patchValue({
        title: data.Title || '',
        year: data.Year || '',
        description: data.Plot || '',
        duration_minutes: parseInt(data.Runtime) || 0,
        genre: data.Genre || '',
        language: data.Language || '',
        writers: data.Writer || '',
        actors: data.Actors || '',
        rated: data.Rated || '',
        country: data.Country || '',
        img_link: data.Poster || '',
        release_date: this.changeDate(data.Released)
      });
    }
  }

  // Convert API date to yyyy-mm-dd
  changeDate(Released: string | Date): string {
    const date2 = new Date(Released);
    if (isNaN(date2.getTime())) return '';

    const day = String(date2.getDate()).padStart(2, '0');
    const month = String(date2.getMonth() + 1).padStart(2, '0');
    const year = date2.getFullYear();

    return `${year}-${month}-${day}`;
  }

  onsubmit() {
    if (this.movieForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.http.post('http://localhost:3000/movies/addMovie', this.movieForm.value)
      .subscribe({
        next: (res: any) => {
          console.log('Movie Added Successfully:', res.message || res);
          this.showForm = false;
          this.movieForm.reset();
          this.dialogRef.close(true); // Close dialog & send success flag
        },
        error: (err: any) => {
          if (err.status === 400) console.log('Missing required fields.');
          else if (err.status === 401) console.log('Unauthorized token.');
          else if (err.status === 403) console.log('No permission to add movie.');
          else if (err.status === 500) console.log('Server error.');
          else console.log('Unknown error:', err.message);

          console.error('Error saving movie data:', err);
        }
      });
  }
}
