import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'CarGarageManagement';
  dark = false;
  toggleTheme() {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-light');
  }
  logout() {
    localStorage.removeItem('token');
    location.href = '/#/login';
  }
}
