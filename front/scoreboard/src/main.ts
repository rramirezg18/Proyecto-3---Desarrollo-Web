import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import 'zone.js';

// ❌ NUNCA limpies storage aquí. Esto corre en cada pestaña nueva.
// localStorage.clear();
// sessionStorage.clear();

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
