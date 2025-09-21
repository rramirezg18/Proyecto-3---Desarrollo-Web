import { Routes } from '@angular/router';
import { PlayersListComponent } from './components/players/players-list/players-list';
import { PlayerFormComponent } from './components/players/player-form/player-form';

export const routes: Routes = [
  { path: '', redirectTo: 'score/1', pathMatch: 'full' },

  {
    path: 'score/:id',
    loadComponent: () =>
      import('./features/scoreboard/scoreboard/scoreboard').then(m => m.ScoreboardComponent),
  },
  {
    path: 'control/:id',
    loadComponent: () =>
      import('./features/control/control-panel/control-panel').then(m => m.ControlPanelComponent),
  },

  // 🔹 CRUD de jugadores
  { path: 'players', component: PlayersListComponent },
  { path: 'players/create', component: PlayerFormComponent },
  { path: 'players/edit/:id', component: PlayerFormComponent },

  { path: '**', redirectTo: 'score/1' }
];
