import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login (puedes tener guestGuard si quieres)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
  },

  // Redirecciones cuando faltan IDs
  { path: 'score', pathMatch: 'full', redirectTo: 'score/1' },
  { path: 'control', pathMatch: 'full', redirectTo: 'control/1' },

  // Admin dashboard
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin-dashboard').then(m => m.AdminDashboardComponent),
  },

  // Protegidas
  {
    path: 'score/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/scoreboard/scoreboard/scoreboard').then(m => m.ScoreboardComponent),
  },
  {
    path: 'control/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/control/control-panel/control-panel').then(m => m.ControlPanelComponent),
  },

  // Páginas admin
  {
    path: 'players',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/players/players').then(m => m.PlayersComponent),
  },
  {
    path: 'teams',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/teams/teams').then(m => m.TeamsComponent),
  },
  {
    path: 'tournaments',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/tournaments/tournaments').then(m => m.TournamentsComponent),
  },

  { path: '**', redirectTo: 'login' }
];
