// image-tracer.service.ts
import { Injectable } from '@angular/core';
import {
  Feature,
  GeoJSON,
  Geometry,
  FeatureCollection,
  Polygon,
  Position,
} from 'geojson';
import * as potrace from 'potrace';
import * as svgson from 'svgson';
import * as turf from '@turf/turf';
import { TraceOptions, FeatureProperties, SvgScale } from './interfaces';

interface PotraceOptions extends TraceOptions {
  background?: string | undefined;
  alphaMax?: number;
  optCurve?: boolean;
  optTolerance?: number;
}

interface GeoJsonFeatureProperties {
  id: string;
  stroke: string;
  fill: string;
  'stroke-width': number;
}

type GeoJsonFeature = Feature<Polygon, GeoJsonFeatureProperties>;

@Injectable({
  providedIn: 'root',
})
export class ImageTracerService {
  constructor() {}

  async convertImageToGeoJson(
    file: File,
    options?: TraceOptions
  ): Promise<GeoJSON> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          if (file.type === 'image/svg+xml') {
            const svgContent = event.target?.result as string;
            const geoJson = await this.convertSvgToGeoJson(svgContent);
            resolve(geoJson);
          } else {
            const img = new Image();
            img.onload = async () => {
              try {
                const svg = await this.traceImageToSvg(img, options);
                const geoJson = await this.convertSvgToGeoJson(svg);
                resolve(geoJson);
              } catch (error) {
                reject(error);
              }
            };
            img.src = event.target?.result as string;
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      if (file.type === 'image/svg+xml') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  }

  private async convertSvgToGeoJson(svg: string): Promise<GeoJSON> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgElement = doc.documentElement;

    // Extract viewBox and dimensions
    const viewBox = svgElement
      .getAttribute('viewBox')
      ?.split(/[\s,]+/)
      .map(Number);
    const width = parseFloat(svgElement.getAttribute('width') || '100');
    const height = parseFloat(svgElement.getAttribute('height') || '100');

    const scale = {
      x: viewBox ? width / (viewBox[2] - viewBox[0]) : 1,
      y: viewBox ? height / (viewBox[3] - viewBox[1]) : 1,
      offsetX: viewBox ? -viewBox[0] : 0,
      offsetY: viewBox ? viewBox[3] : height, // Changed to flip coordinates
    };

    // Find all paths in the SVG
    const paths = Array.from(doc.querySelectorAll('path'));

    // Process each path
    const features = await Promise.all(
      paths.map(async (path, index) => {
        try {
          const d = path.getAttribute('d');
          if (!d) return null;

          // Parse path and transform coordinates
          const coordinates = this.parseSvgPath(d);
          if (!coordinates || coordinates.length < 3) return null;

          // Apply scale and transformations with y-coordinate flipped
          const scaledCoords = coordinates.map(
            ([x, y]) =>
              [
                x * scale.x + scale.offsetX,
                scale.offsetY - y * scale.y, // Flip the y-coordinate
              ] as [number, number]
          );

          // Clean up the coordinates
          const cleanedCoords = this.cleanCoordinates(scaledCoords);
          if (cleanedCoords.length < 4) return null;

          // Create valid polygon
          const polygon = this.createValidPolygon(cleanedCoords);
          if (!polygon) return null;

          const feature: GeoJsonFeature = {
            type: 'Feature',
            properties: {
              id: `shape-${index}`,
              stroke: path.getAttribute('stroke') || '#000000',
              fill: path.getAttribute('fill') || '#cccccc',
              'stroke-width': 1,
            },
            geometry: polygon.geometry,
          };

          console.log(
            'Generated GeoJSON Feature:',
            JSON.stringify(feature, null, 2)
          );
          return feature;
        } catch (error) {
          console.error('Error processing path:', error);
          return null;
        }
      })
    );

    const validFeatures = features.filter(
      (f): f is GeoJsonFeature => f !== null
    );

    const geoJson: FeatureCollection<Polygon, GeoJsonFeatureProperties> = {
      type: 'FeatureCollection',
      features: validFeatures,
    };

    console.log('Final GeoJSON:', JSON.stringify(geoJson, null, 2));
    return geoJson;
  }

  private parseSvgPath(pathData: string): [number, number][] {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);

    const length = path.getTotalLength();
    const points: [number, number][] = [];
    const numPoints = Math.max(200, Math.ceil(length / 1.5)); // Increased sampling density

    for (let i = 0; i <= numPoints; i++) {
      const point = path.getPointAtLength((i / numPoints) * length);
      points.push([point.x, point.y]);
    }

    return this.cleanPoints(points);
  }

  private cleanPoints(points: [number, number][]): [number, number][] {
    const minDistance = 0.001; // Further increased minimum distance for aggressive filtering
    const cleaned: [number, number][] = [];

    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (
        cleaned.length === 0 ||
        Math.sqrt(
          Math.pow(x - cleaned[cleaned.length - 1][0], 2) +
          Math.pow(y - cleaned[cleaned.length - 1][1], 2)
        ) > minDistance
      ) {
        cleaned.push([x, y]);
      }
    }

    // Ensure the path is closed if it represents a polygon
    if (
      cleaned.length > 2 &&
      (cleaned[0][0] !== cleaned[cleaned.length - 1][0] ||
        cleaned[0][1] !== cleaned[cleaned.length - 1][1])
    ) {
      cleaned.push([...cleaned[0]]);
    }

    return cleaned;
  }

  private traceImageToSvg(
    img: HTMLImageElement,
    options: TraceOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }

      const maxDimension = 800; // Reduced for better processing
      const ratio = Math.min(
        maxDimension / img.width,
        maxDimension / img.height
      );
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Use better image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const traceOptions: PotraceOptions = {
        color: options.color || '#000000',
        threshold: options.threshold !== undefined ? options.threshold : 128,
        turdSize: options.turdSize || 15, // Increased to remove small artifacts
        alphaMax: 0.5, // Lower alpha max for smoother curves
        turnPolicy: options.turnPolicy || 'black',
        optCurve: true,
        optTolerance: 0.2,
        background: options.background ?? undefined,
      };

      const imageDataUrl = canvas.toDataURL('image/png');
      potrace.trace(
        imageDataUrl,
        traceOptions,
        (err: Error | null, svg: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(svg);
          }
        }
      );
    });
  }

  private cleanCoordinates(coords: [number, number][]): [number, number][] {
    const minDistance = 0.0005; // Increased minimum distance to filter out closely spaced points
    const normalized = coords.filter((point, index, array) => {
      if (index === 0) return true;
      const prev = array[index - 1];
      const distance = Math.sqrt(
        Math.pow(point[0] - prev[0], 2) + Math.pow(point[1] - prev[1], 2)
      );
      return distance > minDistance;
    });

    if (normalized.length < 4) return normalized;

    // Ensure the polygon is properly closed
    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      normalized.push([...first]);
    }

    try {
      const line = turf.lineString(normalized);
      const simplified = turf.simplify(line, {
        tolerance: 0.0001, // Adjusted tolerance for better simplification
        highQuality: true,
        mutate: false,
      });

      return simplified.geometry.coordinates as [number, number][];
    } catch (error) {
      console.warn('Error simplifying coordinates:', error);
      return normalized;
    }
  }

  private createValidPolygon(
    coords: [number, number][]
  ): Feature<Polygon> | null {
    try {
      if (coords.length < 4) return null;

      const polygon = turf.polygon([coords]);
      if (!turf.booleanValid(polygon)) {
        const buffered = turf.buffer(turf.lineString(coords), 0.000001, {
          units: 'degrees',
          steps: 32, // Increased steps for smoother edges
        });

        if (!buffered) return null;

        const bufferedCoords = buffered.geometry.coordinates[0] as Position[];
        const simplified = turf.simplify(turf.polygon([bufferedCoords]), {
          tolerance: 0.00005,
          highQuality: true,
        });

        // Ensure the polygon is properly closed
        const first = simplified.geometry.coordinates[0][0];
        const last = simplified.geometry.coordinates[0][
          simplified.geometry.coordinates[0].length - 1
        ];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          simplified.geometry.coordinates[0].push([...first]);
        }

        return simplified;
      }

      return polygon;
    } catch (error) {
      console.warn('Error creating polygon:', error);
      return null;
    }
  }
}
