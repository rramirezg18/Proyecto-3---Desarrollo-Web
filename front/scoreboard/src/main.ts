import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import 'zone.js';

// ❌ No borres storage aquí (esto corre en cada pestaña).
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
