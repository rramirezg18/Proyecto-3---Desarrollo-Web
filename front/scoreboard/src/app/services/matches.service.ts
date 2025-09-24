import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

/** DTO que envía el frontend para programar un partido (lo que espera tu API) */
export interface ScheduleMatchDto {
  homeTeamId: number;
  awayTeamId: number;
  dateMatchUtc: string;           // ISO UTC (ej: "2025-10-01T02:00:00Z")
  quarterDurationSeconds: number; // 600 por defecto si no quieres pensar mucho
  // Si luego agregas roster en el backend, ya tienes estos campos listos:
  homeRosterPlayerIds?: number[];
  awayRosterPlayerIds?: number[];
}

/** Item que usa la UI en listados */
export interface MatchListItem {
  id: number;
  dateMatch: string;   // ISO (mapeado desde dateMatchUtc)
  status: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeFouls: number;
  awayFouls: number;
}

/** Respuesta paginada del backend */
export interface PaginatedMatches {
  items: MatchListItem[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class MatchesService {
  // private base = 'http://localhost:5003/api/matches';
  private base = '/api/matches';

  constructor(private http: HttpClient) {}

  /** POST /api/matches/programar  ->  { matchId: number } */
  programar(dto: ScheduleMatchDto): Observable<{ matchId: number }> {
    // El backend ignora campos extra, así que puedes mandar los roster aunque aún no se usen.
    return this.http.post<{ matchId: number }>(`${this.base}/programar`, dto);
  }

  /**
   * GET /api/matches/list (paginado)
   * El backend devuelve { items, total, page, pageSize } con campos:
   *   id, dateMatchUtc, status, homeTeam, awayTeam, homeScore, awayScore, ...
   */
  list(params?: {
    page?: number;
    pageSize?: number;
    status?: string;         // "Scheduled" | "Live" | "Finished"...
    teamId?: number;
    fromUtc?: string;        // "2025-09-01T00:00:00Z"
    toUtc?: string;          // "2025-10-01T00:00:00Z"
  }): Observable<PaginatedMatches> {
    const p = new URLSearchParams();
    p.set('page', String(params?.page ?? 1));
    p.set('pageSize', String(params?.pageSize ?? 10));
    if (params?.status) p.set('status', params.status);
    if (params?.teamId) p.set('teamId', String(params.teamId));
    if (params?.fromUtc) p.set('from', params.fromUtc);
    if (params?.toUtc) p.set('to', params.toUtc);

    return this.http.get<any>(`${this.base}/list?${p.toString()}`).pipe(
      map(resp => ({
        items: (resp.items ?? []).map((m: any) => this.mapToListItem(m)),
        total: resp.total ?? 0,
        page: resp.page ?? 1,
        pageSize: resp.pageSize ?? (resp.items?.length ?? 0),
      }))
    );
  }

  /** GET /api/matches/proximos -> lista simple (sin paginar) */
  proximos(): Observable<MatchListItem[]> {
    return this.http.get<any[]>(`${this.base}/proximos`).pipe(
      map(arr => (arr ?? []).map(m => this.mapToListItem(m)))
    );
  }

  /** GET /api/matches/{id} -> detalle (incluye homeFouls/awayFouls y marcador) */
  getById(id: number): Observable<MatchListItem> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map(m => this.mapToListItem(m))
    );
  }

  /** Mapper seguro backend -> UI */
  private mapToListItem(m: any): MatchListItem {
    return {
      id: m.id,
      dateMatch: m.dateMatchUtc ?? m.dateMatch ?? null,
      status: m.status ?? '',
      homeTeam: m.homeTeam ?? (m.homeTeamName ?? ''),
      awayTeam: m.awayTeam ?? (m.awayTeamName ?? ''),
      homeScore: m.homeScore ?? 0,
      awayScore: m.awayScore ?? 0,
      homeFouls: m.homeFouls ?? 0,
      awayFouls: m.awayFouls ?? 0,
    };
  }
}
