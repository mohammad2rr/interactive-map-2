import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { IranMapComponent } from './features/iran-map/iran-map.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'iran-map',
    component: IranMapComponent,
  },
];
