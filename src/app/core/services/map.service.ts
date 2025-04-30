import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as d3 from 'd3';

export interface Country {
  code: string;
  name: string;
  geometry: any;
  type?: string;
  properties?: {
    featurecla?: string;
    scalerank?: number;
    LABELRANK?: number;
    SOVEREIGNT?: string;
    SOV_A3?: string;
    ADM0_DIF?: number;
    LEVEL?: number;
    TYPE?: string;
    TLC?: string;
  };
}

export interface Province {
  code: string;
  name: string;
  geometry: any;
  countryCode: string;
  properties?: {
    GID_2?: string;
    GID_0?: string;
    COUNTRY?: string;
    GID_1?: string;
    NAME_1?: string;
    NL_NAME_1?: string;
    NAME_2?: string;
    VARNAME_2?: string;
    NL_NAME_2?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private baseUrl = 'assets/maps';

  constructor(private http: HttpClient) {}

  getWorldMap(): Observable<Country[]> {
    return this.http.get(`${this.baseUrl}/world-110m.json`).pipe(
      map((data: any) => {
        return data.features.map((feature: any) => ({
          code: feature.properties.SOV_A3,
          name: feature.properties.SOVEREIGNT,
          geometry: feature.geometry,
          type: feature.type,
          properties: feature.properties,
        }));
      })
    );
  }

  getIranMap(): Observable<Province[]> {
    return this.http.get(`${this.baseUrl}/iran-map/iran-map.json`).pipe(
      map((data: any) => {
        return data.features.map((feature: any) => ({
          code: feature.properties.GID_2,
          name: feature.properties.NAME_2 || feature.properties.NAME_1,
          geometry: feature.geometry,
          countryCode: 'IRN',
          properties: feature.properties,
        }));
      })
    );
  }

  getProvinceDetails(provinceCode: string): Observable<Province | undefined> {
    return this.getIranMap().pipe(
      map((provinces) => provinces.find((p) => p.code === provinceCode))
    );
  }

  getCountryMap(countryCode: string): Observable<Country> {
    return this.getWorldMap().pipe(
      tap((countries: Country[]) =>
        console.log(countries.find((c: Country) => c.code === countryCode))
      ),
      map(
        (countries: Country[]) =>
          countries.find((c: Country) => c.code === countryCode) || {
            code: countryCode,
            name: '',
            geometry: { type: 'Point', coordinates: [0, 0] },
          }
      )
    );
  }

  getProvinceMap(
    countryCode: string,
    provinceCode: string
  ): Observable<Province> {
    return this.getIranMap().pipe(
      map(
        (provinces) =>
          provinces.find((p) => p.code === provinceCode) || {
            code: provinceCode,
            name: '',
            geometry: { type: 'Point', coordinates: [0, 0] },
            countryCode,
          }
      )
    );
  }
}
