import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPasswordComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService) {}

  reset() {
    const data = {
      email: this.email,
      newPassword: this.password,
    };

    this.auth.resetPassword(data).subscribe((res) => {
      alert('Password Reset Successful');
    });
  }
}
