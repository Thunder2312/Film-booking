import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-admin-home',
  imports: [HeaderComponent, HttpClientModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  links = [
  { label: 'Add Movies', path: 'new-movie' },
  { label: 'Manage Theater', path: 'theatres' },
  { label: 'Add ShowTimes', path: 'add-showtimes' },
  { label: 'Admin Approval', path: 'approval' },
  {label: 'Manage Movie', path: 'manage-movie'},
  {label: 'Manage ShowTimes', path:  'manage-showtimes'}
];

}
