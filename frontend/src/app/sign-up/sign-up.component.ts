import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signUpData } from './signup-data.model';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PasswordToggleDirective } from '../directives/password-toggle.directive';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sign-up',
  imports: [HeaderComponent, CommonModule, FormsModule, HttpClientModule, PasswordToggleDirective],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  baseUrl = environment.apiUrl;

  constructor(private router: Router, private httpclient: HttpClient) { }
  goHome() {
    this.router.navigate(['/'])
  }

  signUpInfo: signUpData = {
    username: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ADMIN',
    role_approval: false
  };

  onSubmit() {
    this.httpclient.post(`${this.baseUrl}/user/register`, this.signUpInfo).subscribe({
      next: res => {
        console.log('SignUp completed', res)
        this.goHome();
      },
      error: err => {
        console.log('Registration failed', err)
      }
    })
  }
}
