import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { PasswordToggleDirective } from '../directives/password-toggle.directive';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    HeaderComponent,
    PasswordToggleDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss',
})
export class LoginCardComponent {

  username = new FormControl<string>('', { nonNullable: true });
  password = new FormControl<string>('', { nonNullable: true });

  baseUrl = environment.apiUrl;


  loginError: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  gotoSignup() {
    this.router.navigate(['']);
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Page reload ke liye hai bhai
    if (this.username.invalid || this.password.invalid) {
      this.loginError = 'Please enter username and password.';
      return;
    }

    const loginData = {
      username: this.username.value,
      password: this.password.value,
    };

    this.loginError = null;

    this.http.post<any>(`${this.baseUrl}/user/login`, loginData).subscribe({
      next: (res) => {
        const token = res.token;
        if (token) {
          sessionStorage.setItem('jwtToken', token);
          sessionStorage.setItem('username', loginData.username);

          console.log('Logged in');
          this.router.navigate(['/admin']);
        } else {
          this.loginError = 'Login failed: No token received.';
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.loginError = 'Invalid username or password.';
        } else if (err.status === 500) {
          this.loginError = 'Server error. Please try again later.';
        } else {
          this.loginError = err.error.message;
        }
        console.error('Error saving login data:', err);
      },
    });
  }
}
