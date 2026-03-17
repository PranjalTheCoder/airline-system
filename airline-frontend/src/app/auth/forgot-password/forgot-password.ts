import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private auth: AuthService) {}

  forgot() {
    this.auth.forgotPassword(this.email).subscribe((res) => {
      alert('Reset link sent');
    });
  }
}
