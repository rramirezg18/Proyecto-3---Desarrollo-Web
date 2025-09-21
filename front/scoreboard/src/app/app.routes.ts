import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

import { PlayersListComponent } from './components/players/players-list/players-list';
import { PlayerFormComponent } from './components/players/player-form/player-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },

  // Admin dashboard (solo administradores)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-dashboard').then(m => m.AdminDashboardComponent),
  },

  // Scoreboard y control (logueado)
  {
    path: 'score/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/scoreboard/scoreboard/scoreboard').then(m => m.ScoreboardComponent),
  },
  {
    path: 'control/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/control/control-panel/control-panel').then(m => m.ControlPanelComponent),
  },

  // 🔹 CRUD de jugadores (solo admin)
  { path: 'players', canActivate: [authGuard, adminGuard], component: PlayersListComponent },
  { path: 'players/create', canActivate: [authGuard, adminGuard], component: PlayerFormComponent },
  { path: 'players/edit/:id', canActivate: [authGuard, adminGuard], component: PlayerFormComponent },

  // Páginas admin
  {
    path: 'teams',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/teams/teams').then(m => m.TeamsComponent),
  },
  {
    path: 'tournaments',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/tournaments/tournaments').then(m => m.TournamentsComponent),
  },

  { path: '**', redirectTo: 'login' }
];

