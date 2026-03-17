import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent {
  user: any;

  constructor(private auth: AuthService) {
    this.auth.getProfile('admin').subscribe((res) => {
      this.user = res;
    });
  }
}
