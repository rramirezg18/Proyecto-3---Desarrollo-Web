import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Team } from '../../models/team';
import { Player } from '../../models/player';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import {
  MatchesService,
  MatchListItem,
  ScheduleMatchDto,
  FinishMatchDto,
  FoulItem,
  ScoreEventItem
} from '../../services/matches.service';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    RouterModule
  ],
  templateUrl: './tournaments.html',
  styleUrls: ['./tournaments.css']
})
export class TournamentsComponent implements OnInit {

  form: FormGroup<{
    homeTeamId: FormControl<number | null>;
    awayTeamId: FormControl<number | null>;
    dateMatch: FormControl<Date | null>;
    quarterDurationSeconds: FormControl<number | null>;
    status: FormControl<string | null>;
    homeRoster: FormControl<number[]>;
    awayRoster: FormControl<number[]>;
  }>;

  teams = signal<Team[]>([]);
  homePlayers = signal<Player[]>([]);
  awayPlayers = signal<Player[]>([]);
  matches = signal<MatchListItem[]>([]);

  displayedColumns = ['dateMatch', 'status', 'home', 'away', 'score', 'fouls', 'actions'];

  // Base del API para obtener detalle RAW del match (incluye homeTeamId/awayTeamId)
  private readonly base = '/api/matches';

  constructor(
    private fb: FormBuilder,
    private teamsSvc: TeamService,
    private playersSvc: PlayerService,
    private matchesSvc: MatchesService,
    private snack: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.nonNullable.group({
      homeTeamId: new FormControl<number | null>(null, { nonNullable: false, validators: [Validators.required] }),
      awayTeamId: new FormControl<number | null>(null, { nonNullable: false, validators: [Validators.required] }),
      dateMatch: new FormControl<Date | null>(new Date(), { nonNullable: false, validators: [Validators.required] }),
      quarterDurationSeconds: new FormControl<number | null>(600, { nonNullable: false, validators: [Validators.required, Validators.min(60)] }),
      status: new FormControl<string | null>('Programado', { nonNullable: false, validators: [Validators.required] }),
      homeRoster: new FormControl<number[]>([], { nonNullable: true }),
      awayRoster: new FormControl<number[]>([], { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.refreshLists();
  }

  /* ================== carga de datos ================== */

  private loadTeams(): void {
    this.teamsSvc.getTeams(1, 1000).subscribe({
      next: (res) => this.teams.set(res.items ?? []),
      error: () => this.snack.open('No se pudieron cargar los equipos', 'Cerrar', { duration: 2500 })
    });
  }

  onHomeTeamChange(): void {
    const id = this.form.value.homeTeamId;
    this.form.patchValue({ homeRoster: [] }, { emitEvent: false });
    if (!id) { this.homePlayers.set([]); return; }
    this.playersSvc.getByTeam(id).subscribe({
      next: p => this.homePlayers.set(p),
      error: () => this.snack.open('Error cargando jugadores del local', 'Cerrar', { duration: 2500 })
    });
  }

  onAwayTeamChange(): void {
    const id = this.form.value.awayTeamId;
    this.form.patchValue({ awayRoster: [] }, { emitEvent: false });
    if (!id) { this.awayPlayers.set([]); return; }
    this.playersSvc.getByTeam(id).subscribe({
      next: p => this.awayPlayers.set(p),
      error: () => this.snack.open('Error cargando jugadores de la visita', 'Cerrar', { duration: 2500 })
    });
  }

  /* ================== acciones ================== */

  programMatch(): void {
    const v = this.form.value;
    if (!v.homeTeamId || !v.awayTeamId || !v.dateMatch || !v.quarterDurationSeconds) {
      this.snack.open('Completa el formulario', 'Cerrar', { duration: 2500 });
      return;
    }

    const dto: ScheduleMatchDto = {
      homeTeamId: v.homeTeamId!,
      awayTeamId: v.awayTeamId!,
      dateMatchUtc: (v.dateMatch as Date).toISOString(),
      quarterDurationSeconds: v.quarterDurationSeconds!,
      homeRosterPlayerIds: v.homeRoster ?? [],
      awayRosterPlayerIds: v.awayRoster ?? []
    };

    this.matchesSvc.programar(dto).subscribe({
      next: () => {
        this.snack.open('Partido programado', 'OK', { duration: 2000 });
        this.form.reset({
          dateMatch: new Date(),
          quarterDurationSeconds: 600,
          homeRoster: [],
          awayRoster: []
        }, { emitEvent: false });
        this.homePlayers.set([]); this.awayPlayers.set([]);
        this.refreshLists();
      },
      error: (err) => {
        console.error('Programar error:', err);
        this.snack.open(err?.error ?? 'Error al programar el partido', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private refreshLists(): void {
    this.matchesSvc.list({ page: 1, pageSize: 10 }).subscribe({
      next: (resp) => this.matches.set(resp.items),
      error: () => this.snack.open('No se pudieron cargar los partidos', 'Cerrar', { duration: 2500 })
    });
  }

  /* ================== Acciones por fila ================== */

  goToControl(row: MatchListItem): void {
    this.router.navigate(['/control', row.id]);
  }

  /**
   * Simula marcador y faltas, y cierra el partido con /api/matches/{id}/finish
   * Registramos faltas reales en BD para que la tabla muestre conteo.
   */
  finishSim(row: MatchListItem): void {
    // 1) Traer detalle RAW para tener homeTeamId/awayTeamId
    this.http.get<any>(`${this.base}/${row.id}`).subscribe({
      next: (detail) => {
        const homeTeamId: number = detail.homeTeamId;
        const awayTeamId: number = detail.awayTeamId;

        // 2) Simulación simple
        const homeScore = 60 + Math.floor(Math.random() * 41); // 60..100
        const awayScore = 55 + Math.floor(Math.random() * 41); // 55..95
        const homeFoulsCount = 8 + Math.floor(Math.random() * 9); // 8..16
        const awayFoulsCount = 8 + Math.floor(Math.random() * 9); // 8..16

        // Eventos de score (opcional): registramos algunos tiros de 2 y 3
        const makeScoreEvents = (teamId: number, total: number): ScoreEventItem[] => {
          const events: ScoreEventItem[] = [];
          let sum = 0;
          while (sum < total) {
            const shot = Math.random() < 0.3 ? 3 : 2; // mezcla 2s y 3s
            if (sum + shot > total) break;
            events.push({ teamId, points: shot });
            sum += shot;
          }
          // Si faltó 1 punto para exacto, lo rellenamos (free throw)
          if (sum < total) {
            events.push({ teamId, points: 1 });
          }
          return events;
        };

        const scoreEvents: ScoreEventItem[] = [
          ...makeScoreEvents(homeTeamId, homeScore),
          ...makeScoreEvents(awayTeamId, awayScore),
        ];

        // Faltas: sólo importa teamId y fecha
        const nowIso = new Date().toISOString();
        const fouls: FoulItem[] = [
          ...Array.from({ length: homeFoulsCount }, () => ({ teamId: homeTeamId, dateRegister: nowIso })),
          ...Array.from({ length: awayFoulsCount }, () => ({ teamId: awayTeamId, dateRegister: nowIso })),
        ];

        const dto: FinishMatchDto = {
          homeScore,
          awayScore,
          homeFouls: homeFoulsCount,
          awayFouls: awayFoulsCount,
          scoreEvents,
          fouls
        };

        // 3) Cerrar partido
        this.matchesSvc.finish(row.id, dto).subscribe({
          next: () => {
            this.snack.open('Partido simulado y finalizado', 'OK', { duration: 2000 });
            this.refreshLists();
          },
          error: (err) => {
            console.error('Finish error:', err);
            this.snack.open('No se pudo finalizar el partido', 'Cerrar', { duration: 2500 });
          }
        });
      },
      error: () => {
        this.snack.open('No se pudo obtener el detalle del partido', 'Cerrar', { duration: 2500 });
      }
    });
  }
}
