import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:5003/api/teams';
; // 👈 Ajusta según tu backend

  constructor(private http: HttpClient) {}

  // 👇 este es el método que falta
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  update(id: number, team: Team): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
