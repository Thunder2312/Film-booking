import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentUrl: string = '';

  constructor(private router: Router) {
    // Listen for navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  // Derived getters
  get isLoginPage(): boolean {
    return this.currentUrl === '/login';
  }

  get isSignUpPage(): boolean {
    return this.currentUrl === '/signup';
  }

  get isAdminPage(): boolean {
    return this.currentUrl.startsWith('/admin');
  }

  // Show login only if not on admin and not on login page
  get showLoginButton(): boolean {
    return !this.isAdminPage && !this.isLoginPage;
  }

  // Show signup only if not on admin and not on signup page
  get showSignUpButton(): boolean {
    return !this.isAdminPage && !this.isSignUpPage;
  }



  // Show logout when user is logged in
get showLogoutButton(): boolean {
  return this.isLoggedIn &&
         !this.isLoginPage &&
         !this.isSignUpPage;
}

  get isLoggedIn(): boolean {
  return !!sessionStorage.getItem('jwtToken');
}


  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  logOut() {
    sessionStorage.removeItem('jwtToken');
    this.router.navigate(['/']);
  }
}
