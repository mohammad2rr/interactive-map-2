// geo-json-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeoJSON } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class GeoJsonStateService {
  private geoJsonDataSubject = new BehaviorSubject<GeoJSON | null>(null);
  geoJsonData$ = this.geoJsonDataSubject.asObservable();

  updateGeoJsonData(data: GeoJSON): void {
    this.geoJsonDataSubject.next(data);
  }

  clearGeoJsonData(): void {
    this.geoJsonDataSubject.next(null);
  }
}
