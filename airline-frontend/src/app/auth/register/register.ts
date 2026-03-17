import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private auth: AuthService) {}

  register() {
    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.auth.register(data).subscribe((res) => {
      alert('User Registered Successfully');
    });
  }
}
