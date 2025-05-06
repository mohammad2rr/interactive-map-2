import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { reducers } from './store';
import { MapEffects } from './store/map/map.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  MonacoEditorModule,
  NGX_MONACO_EDITOR_CONFIG,
} from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';

export const monacoConfig = {
  baseUrl: 'assets/monaco-editor',
  defaultOptions: {
    scrollBeyondLastLine: false,
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true,
    minimap: { enabled: false },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(reducers),
    provideEffects([MapEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    importProvidersFrom(MonacoEditorModule.forRoot(), FormsModule),
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: monacoConfig,
    },
  ],
};
