import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { LoginResponseDto } from '../models/login-response.dto';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = 'http://localhost:5003/api/auth';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  private storage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try { return window.localStorage; } catch { return null; }
  }

  login(username: string, password: string): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, { username, password });
  }

  saveUser(userData: LoginResponseDto) {
    const s = this.storage();
    if (!s) return;
    s.setItem('user', JSON.stringify(userData));
    if (userData.token) s.setItem('token', userData.token);
  }

  getUser(): any | null {
    const s = this.storage();
    const raw = s?.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  getToken(): string | null {
    const s = this.storage();
    return s?.getItem('token') ?? null;
  }

  isAdmin(): boolean {
    const u = this.getUser();
    return u?.role?.name?.toLowerCase() === 'admin';
  }

  logout() {
  console.error('[AUTH.logout] called');
  console.trace('[AUTH.logout trace]');
  const s = this.storage();
  s?.removeItem('user');
  s?.removeItem('token');
}

}
