import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from 'geojson';

export interface Country {
  id: string;
  name: string;
  path: string;
}

export interface Province {
  id: string;
  name: string;
  path: string;
  countryId: string;
}

export interface TopoJsonData {
  type: 'Topology';
  objects: {
    [key: string]: any;
  };
  arcs: number[][][];
}

export interface GeoJsonFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJsonData {
  type: string;
  features: GeoJsonFeature[];
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private baseUrl = 'assets/maps';

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  getLocalWorldMap(): Observable<TopoJsonData> {
    return this.http.get<TopoJsonData>(`${this.baseUrl}/world.json`).pipe(
      catchError(
        this.handleError<TopoJsonData>('getLocalWorldMap', {
          type: 'Topology',
          objects: {},
          arcs: [],
        })
      )
    );
  }

  getLocalCountryMap(countryId: string): Observable<TopoJsonData> {
    return this.http
      .get<TopoJsonData>(`${this.baseUrl}/${countryId}.json`)
      .pipe(
        catchError(
          this.handleError<TopoJsonData>('getLocalCountryMap', {
            type: 'Topology',
            objects: {},
            arcs: [],
          })
        )
      );
  }

  getLocalProvinceMap(
    countryId: string,
    provinceId: string
  ): Observable<TopoJsonData> {
    return this.http
      .get<TopoJsonData>(`${this.baseUrl}/${countryId}/${provinceId}.json`)
      .pipe(
        catchError(
          this.handleError<TopoJsonData>('getLocalProvinceMap', {
            type: 'Topology',
            objects: {},
            arcs: [],
          })
        )
      );
  }

  getWorldMap(): Observable<TopoJsonData> {
    return this.getLocalWorldMap();
  }

  getCountryMap(countryId: string): Observable<TopoJsonData> {
    return this.getLocalCountryMap(countryId);
  }

  getProvinceMap(
    countryId: string,
    provinceId: string
  ): Observable<TopoJsonData> {
    return this.getLocalProvinceMap(countryId, provinceId);
  }

  transformTopoToGeo(
    topoData: TopoJsonData
  ): FeatureCollection<Geometry, GeoJsonProperties> {
    if (!topoData.objects || Object.keys(topoData.objects).length === 0) {
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }

    try {
      const feature = topojson.feature(
        topoData as any,
        topoData.objects[Object.keys(topoData.objects)[0]]
      );
      return {
        type: 'FeatureCollection',
        features: [feature],
      };
    } catch (error) {
      console.error('Error transforming TopoJSON to GeoJSON:', error);
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }
  }

  createMapProjection(
    width: number,
    height: number,
    geoData: FeatureCollection<Geometry>
  ): d3.GeoProjection {
    try {
      const projection = d3.geoMercator().fitSize([width, height], geoData);
      return projection;
    } catch (error) {
      console.error('Error creating map projection:', error);
      return d3.geoMercator();
    }
  }
}
