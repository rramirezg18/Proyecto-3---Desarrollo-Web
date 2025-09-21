import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { PlayerService } from '../../../services/player.service';
import { Player } from '../../../models/player';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './players-list.html',
  styleUrls: ['./players-list.scss']
})
export class PlayersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'number', 'name', 'teamName', 'actions'];
  dataSource: Player[] = [];

  totalItems = 0;
  page = 1;
  pageSize = 5;

  teamId: number | null = null;
  search: string = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.loadPlayers();
  }

  // 📌 Cargar jugadores con filtros
  loadPlayers() {
    this.playerService.getPlayers(this.page, this.pageSize).subscribe(res => {
      let players = res.items;

      if (this.teamId) {
        players = players.filter(p => p.teamId === this.teamId);
      }

      if (this.search) {
        players = players.filter(p =>
          p.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }

      this.dataSource = players;
      this.totalItems = res.totalCount;
    });
  }

  applyFilter() {
    this.page = 1;
    this.loadPlayers();
  }

  deletePlayer(id: number) {
    if (confirm('¿Eliminar jugador?')) {
      this.playerService.delete(id).subscribe(() => this.loadPlayers());
    }
  }

  // 📌 Nuevo método para manejar el paginador
  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1; // Angular paginator empieza en 0
    this.pageSize = event.pageSize;
    this.loadPlayers();
  }
}

