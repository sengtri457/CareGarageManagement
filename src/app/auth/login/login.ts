import { Component } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private api: Apiservice, private router: Router) {}

  login(event: any) {
    event.preventDefault();
    this.api
      .post('auth/login', { username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.error = 'Invalid credentials';
        },
      });
  }
}
