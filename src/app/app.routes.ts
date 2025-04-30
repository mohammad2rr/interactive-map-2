import { Routes } from '@angular/router';
import { WorldMapComponent } from './features/world-map/world-map.component';
import { CountryMapComponent } from './features/country-map/country-map.component';
import { ProvinceMapComponent } from './features/province-map/province-map.component';
import { IranMapComponent } from './features/iran-map/iran-map.component';

export const routes: Routes = [
  {
    path: 'home',
    component: WorldMapComponent,
  },
  {
    path: 'home/:countryId',
    component: CountryMapComponent,
  },
  {
    path: 'home/:countryId/:provinceId',
    component: ProvinceMapComponent,
  },
  {
    path: 'iran-map',
    component: IranMapComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
