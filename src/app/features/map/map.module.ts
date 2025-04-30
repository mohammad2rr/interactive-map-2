import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { ProvinceMapComponent } from './components/province-map/province-map.component';
import { CountryMapComponent } from './components/country-map/country-map.component';

@NgModule({
  imports: [
    CommonModule,
    MapComponent,
    ProvinceMapComponent,
    CountryMapComponent,
  ],
  exports: [MapComponent, ProvinceMapComponent, CountryMapComponent],
})
export class MapModule {}
