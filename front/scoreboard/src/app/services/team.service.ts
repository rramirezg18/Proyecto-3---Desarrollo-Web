import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 👈 añade esto
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  //private apiUrl = 'http://localhost:5003/api/teams';
  private apiUrl = '/api/teams';

  constructor(private http: HttpClient) {}

  // ✅ Listar equipos con paginación y búsqueda
  getTeams(
    page: number = 1,
    pageSize: number = 10,
    search: string = ''
  ): Observable<{ items: Team[]; totalCount: number }> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (search) {
      params += `&q=${encodeURIComponent(search)}`;
    }
    return this.http.get<{ items: Team[]; totalCount: number }>(
      `${this.apiUrl}${params}`
    );
  }

  // ✅ Helper para “traer todos” (útil para selects)
  getAll(): Observable<Team[]> {
    // pide una página grande; ajusta el pageSize si tu API lo limita
    return this.getTeams(1, 1000, '').pipe(map(r => r.items));
  }

  // ✅ Obtener detalle de un equipo
  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  // ✅ Crear equipo
  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  // ✅ Actualizar equipo
  update(id: number, team: Team): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, team);
  }

  // ✅ Eliminar equipo
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
