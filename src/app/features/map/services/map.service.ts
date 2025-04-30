import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}

  getWorldMap(): Promise<d3.ExtendedFeatureCollection> {
    return fetch('assets/data/world.geojson')
      .then((response) => response.json())
      .then((data) => data as d3.ExtendedFeatureCollection);
  }

  getCountryMap(countryCode: string): Promise<d3.ExtendedFeatureCollection> {
    return fetch(`assets/data/countries/${countryCode}.geojson`)
      .then((response) => response.json())
      .then((data) => data as d3.ExtendedFeatureCollection);
  }

  getProvinceMap(
    countryCode: string,
    provinceCode: string
  ): Promise<d3.ExtendedFeatureCollection> {
    return fetch(
      `assets/data/countries/${countryCode}/provinces/${provinceCode}.geojson`
    )
      .then((response) => response.json())
      .then((data) => data as d3.ExtendedFeatureCollection);
  }
}
