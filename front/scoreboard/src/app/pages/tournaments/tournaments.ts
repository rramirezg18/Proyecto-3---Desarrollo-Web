import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { Team } from '../../models/team';
import { Player } from '../../models/player';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import { MatchesService, MatchListItem, ScheduleMatchDto } from '../../services/matches.service';

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
    MatTableModule
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

  // datos para selects y tabla
  teams = signal<Team[]>([]);
  homePlayers = signal<Player[]>([]);
  awayPlayers = signal<Player[]>([]);
  matches = signal<MatchListItem[]>([]);

  displayedColumns = ['dateMatch', 'status', 'home', 'away', 'score', 'fouls'];

  constructor(
    private fb: FormBuilder,
    private teamsSvc: TeamService,
    private playersSvc: PlayerService,
    private matchesSvc: MatchesService,
    private snack: MatSnackBar
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
    this.teamsSvc.getAll().subscribe({
      next: (t) => this.teams.set(t),
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
      next: (resp) => this.matches.set(resp.items), // <- usa resp.items
      error: () => this.snack.open('No se pudieron cargar los partidos', 'Cerrar', { duration: 2500 })
    });
  }

}
