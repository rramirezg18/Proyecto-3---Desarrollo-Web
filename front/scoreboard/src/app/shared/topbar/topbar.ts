import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
  private router = inject(Router);
  auth = inject(AuthenticationService);

  @Input() showAdmin = false;      // Mostrar botón Admin
  @Input() showControl = false;    // Mostrar botón Control
  @Input() showScore = false;      // Mostrar botón Score
  @Input() showLogout = true;      // Mostrar botón Logout

  @Input() controlId?: number;     // ID del partido para Control
  @Input() scoreId?: number;       // ID del partido para Score

  get isAdmin(): boolean {
    try {
      if (typeof this.auth.isAdmin === 'function') return this.auth.isAdmin();
      const saved = localStorage.getItem('user');
      const user = saved ? JSON.parse(saved) : null;
      return user?.role?.name?.toLowerCase() === 'admin';
    } catch { return false; }
  }

  goAdmin()   { this.router.navigate(['/admin']); }
  goControl() { this.router.navigate(['/control', this.controlId ?? 1]); }
  goScore()   { this.router.navigate(['/score',   this.scoreId   ?? 1]); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
