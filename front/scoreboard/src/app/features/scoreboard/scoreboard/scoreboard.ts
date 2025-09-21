import { Component, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // 👈 agrega CommonModule
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../core/api';
import { RealtimeService } from '../../../core/realtime';
import { TeamPanelComponent } from '../../../shared/team-panel/team-panel';
import { TimerComponent } from '../../../shared/timer/timer';
import { QuarterIndicatorComponent } from '../../../shared/quarter-indicator/quarter-indicator';
import { FoulsPanelComponent } from '../../../shared/fouls-panel/fouls-panel';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AdminMenuComponent } from '../../../shared/admin-menu/admin-menu';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [
    CommonModule,              // ✅ necesario para *ngIf
    MatButtonModule,
    TeamPanelComponent,
    TimerComponent,
    QuarterIndicatorComponent,
    FoulsPanelComponent,
    AdminMenuComponent
  ],
  templateUrl: './scoreboard.html',
  styleUrls: ['./scoreboard.css']
})
export class ScoreboardComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  auth = inject(AuthenticationService);     // ✅ público para usar en template
  private router = inject(Router);
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
        this.realtime.hydrateTimerFromSnapshot(m.timer);
        if (m?.fouls) this.realtime.hydrateFoulsFromSnapshot(m.fouls);
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

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
