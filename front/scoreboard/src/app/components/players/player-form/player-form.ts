import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // 👈 necesario para el combo

import { PlayerService } from '../../../services/player.service';
import { TeamService } from '../../../services/team.service';

import { Team } from '../../../models/team';          // 👈 modelo de equipos

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule // 👈 agregado para usar <mat-select>
  ],
  templateUrl: './player-form.html',
  styleUrls: ['./player-form.scss']
})
export class PlayerFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  teams: Team[] = []; // 👈 aquí guardamos los equipos que vienen del backend

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private teamService: TeamService,   // 👈 inyectamos el servicio de equipos
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      teamId: ['', Validators.required]
    });

    // 👇 cargar equipos cuando se abre el form
    this.teamService.getTeams().subscribe(res => this.teams = res);

    // 👇 si es edición, cargar los datos del jugador
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.playerService.getById(this.id).subscribe(p => this.form.patchValue(p));
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.playerService.update(this.id, this.form.value).subscribe(() => this.router.navigate(['/players']));
    } else {
      this.playerService.create(this.form.value).subscribe(() => this.router.navigate(['/players']));
    }
  }
}
