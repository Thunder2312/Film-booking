import { Component } from '@angular/core';
import { signUpData } from '../../sign-up/signup-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-approval',
  imports: [],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {

  baseUrl = environment.apiUrl
  users: any[] = [];
  constructor(private http: HttpClient,) { }


  ngOnInit() {
    this.getUserForApproval();
  }
  getUserForApproval() {
    this.http.get(`${this.baseUrl}/user/approveUser`).subscribe({
      next: (res: any) => {
        this.users = res.map((user: any) => ({
          user_id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role_approval: user.role_approval,
        }));

        console.log(res);
      }
    });


  }

  approveUser(user_id: string) {
    this.http.post(`${this.baseUrl}/user/approveUser`, { user_id }).subscribe({
      next: (res: any) => {
        console.log('User Approved:', res);
        alert(`user id: ${user_id} approved`)
        //use this for instantaneous removal from the list on frontend
        this.users = this.users.filter(user => user.user_id !== user_id);
      },
      error: (err) => {
        console.error('Error deactivating movie:', err);
      }
    })
  }
}
