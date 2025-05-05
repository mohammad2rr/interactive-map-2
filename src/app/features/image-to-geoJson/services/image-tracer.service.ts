// image-tracer.service.ts
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import * as potrace from 'potrace';
import { GeoJSON } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class ImageTracerService {
  constructor() {}

  convertImageToGeoJson(file: File): Promise<GeoJSON> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const params = {
              color: '#000000',
              threshold: 120,
              turdSize: 10,
              turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
            };

            potrace.trace(img, params, (err, svg) => {
              if (err) return reject(err);

              // Convert SVG to GeoJSON (simplified example)
              const geoJson = this.svgToGeoJson(svg);
              resolve(geoJson);
            });
          } catch (error) {
            reject(error);
          }
        };
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private svgToGeoJson(svg: string): GeoJSON {
    // This is a simplified conversion - in reality, you'd need a proper SVG to GeoJSON converter
    // For demonstration, we'll return a sample GeoJSON structure
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Generated Shape',
            id: 'shape-1',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
        },
      ],
    };
  }
}
