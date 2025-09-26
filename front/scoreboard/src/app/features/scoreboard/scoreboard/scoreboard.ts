// src/app/features/scoreboard/scoreboard/scoreboard.ts
import { Component, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

import { ApiService } from '../../../core/api';
import { RealtimeService } from '../../../core/realtime';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { TeamPanelComponent } from '../../../shared/team-panel/team-panel';
import { TimerComponent } from '../../../shared/timer/timer';
import { QuarterIndicatorComponent } from '../../../shared/quarter-indicator/quarter-indicator';
import { FoulsPanelComponent } from '../../../shared/fouls-panel/fouls-panel';
import { TopbarComponent } from '../../../shared/topbar/topbar';
import { AdminMenuComponent } from '../../../shared/admin-menu/admin-menu';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  templateUrl: './scoreboard.html',
  styleUrls: ['./scoreboard.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    TeamPanelComponent,
    TimerComponent,
    QuarterIndicatorComponent,
    FoulsPanelComponent,
    TopbarComponent,
    AdminMenuComponent
  ]
})
export class ScoreboardComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  auth = inject(AuthenticationService);
  realtime = inject(RealtimeService);

  matchId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? '1'));

  homeName = 'A TEAM';
  awayName = 'B TEAM';

  constructor() {
    effect(() => {
      const over = this.realtime.gameOver();
      if (!over || !isPlatformBrowser(this.platformId)) return;

      const text =
        over.winner === 'draw'
          ? `Empate ${over.home} - ${over.away}`
          : over.winner === 'home'
            ? `¡Ganó ${this.homeName}! ${over.home} - ${over.away}`
            : `¡Ganó ${this.awayName}! ${over.away} - ${over.home}`;

      Swal.fire({ title: 'Fin del partido', text, icon: 'warning', position: 'top', showConfirmButton: true });
    });
  }

  async ngOnInit() {
    this.api.getMatch(this.matchId()).subscribe({
      next: (m: any) => {
        this.realtime.score.set({ home: m.homeScore, away: m.awayScore });
        this.homeName = m.homeTeam || 'A TEAM';
        this.awayName = m.awayTeam || 'B TEAM';
        if (typeof m.quarter === 'number') this.realtime.quarter.set(m.quarter); // ✅ set inicial
        this.realtime.hydrateTimerFromSnapshot(m.timer);
        if (m?.fouls) this.realtime.hydrateFoulsFromSnapshot({ home: m.homeFouls ?? 0, away: m.awayFouls ?? 0 });
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      await this.realtime.connect(this.matchId());
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.realtime.disconnect();
    }
  }
}
