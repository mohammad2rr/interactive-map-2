import { Routes } from '@angular/router';
import { MapComponent } from './features/map/components/map/map.component';
import { CountryMapComponent } from './features/map/components/country-map/country-map.component';
import { ProvinceMapComponent } from './features/map/components/province-map/province-map.component';
import { IranMapComponent } from './features/iran-map/iran-map.component';

export const routes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: ':countryCode',
    component: CountryMapComponent,
  },
  {
    path: ':countryCode/:provinceCode',
    component: ProvinceMapComponent,
  },
  {
    path: 'iran-map',
    component: IranMapComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
