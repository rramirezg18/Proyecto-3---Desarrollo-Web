import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponseDto } from '../models/login-response.dto';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = 'http://localhost:5003/api/auth';

  constructor(private http: HttpClient) {}

  // 🔑 Login al backend
  login(username: string, password: string): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, { username, password });
  }

  // 💾 Guardar usuario y token
  saveUser(userData: LoginResponseDto) {
    localStorage.clear(); // ✅ limpia datos previos
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  }

  // ✅ Obtener usuario
  getUser(): any | null {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  // ✅ Obtener rol (solo admin permitido para menú)
  isAdmin(): boolean {
    const u = this.getUser();
    return u?.role?.name?.toLowerCase() === 'admin';
  }

  // ✅ Obtener token (lo que necesita tu guard)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🚪 Cerrar sesión
  logout() {
    localStorage.clear();
  }
}
