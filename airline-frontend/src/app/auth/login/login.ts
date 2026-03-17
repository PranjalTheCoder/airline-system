import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  login() {
    const data = {
      username: this.username,
      password: this.password,
    };

    this.auth.login(data).subscribe((res: any) => {
      localStorage.setItem('token', res.token);

      alert('Login Successful');

      this.router.navigate(['/profile']);
    });
  }
}
