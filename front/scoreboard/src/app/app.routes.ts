// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-dashboard').then(m => m.AdminDashboardComponent),
  },

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

  // Players (como ya lo tienes)
  {
    path: 'players',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/players/players-list/players-list').then(m => m.PlayersListComponent),
  },
  {
    path: 'players/create',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/players/player-form/player-form').then(m => m.PlayerFormComponent),
  },
  {
    path: 'players/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/players/player-form/player-form').then(m => m.PlayerFormComponent),
  },

  // ✅ Teams (misma estructura que players)
  {
    path: 'teams',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/teams/teams-list/teams-list').then(m => m.TeamsListComponent),
  },
  {
    path: 'teams/create',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/teams/team-form/team-form').then(m => m.TeamFormComponent),
  },
  {
    path: 'teams/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/teams/team-form/team-form').then(m => m.TeamFormComponent),
  },

  {
    path: 'tournaments',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/tournaments/tournaments').then(m => m.TournamentsComponent),
  },

  { path: '**', redirectTo: 'login' },
];
