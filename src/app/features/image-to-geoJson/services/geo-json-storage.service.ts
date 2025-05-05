// geo-json-storage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoJSON } from 'geojson';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeoJsonStorageService {
  private apiUrl = environment.apiUrl + '/geojson';

  constructor(private http: HttpClient) {}

  saveGeoJson(geoJson: GeoJSON): Observable<GeoJSON> {
    return this.http.post<GeoJSON>(this.apiUrl, geoJson);
  }

  getGeoJson(id: string): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(`${this.apiUrl}/${id}`);
  }

  getAllGeoJson(): Observable<GeoJSON[]> {
    return this.http.get<GeoJSON[]>(this.apiUrl);
  }
}
