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

          return {
            type: 'Feature',
            properties: {
              id: `shape-${index}`,
              stroke: path.getAttribute('stroke') || '#000000',
              fill: path.getAttribute('fill') || 'none',
              strokeWidth: parseFloat(path.getAttribute('stroke-width') || '1'),
            },
            geometry: polygon.geometry,
          };
        } catch (error) {
          console.warn(`Error processing path at index ${index}:`, error);
          return null;
        }
      })
    );

    const validFeatures = features.filter(
      (f): f is Feature<Polygon, FeatureProperties> => f !== null
    );

    if (validFeatures.length === 0) {
      throw new Error('No valid features could be created from the SVG');
    }

    return {
      type: 'FeatureCollection',
      features: validFeatures,
    };
  }

  private parseSvgPath(pathData: string): [number, number][] {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);

    const length = path.getTotalLength();
    const points: [number, number][] = [];
    const numPoints = Math.max(100, Math.ceil(length / 2));

    for (let i = 0; i <= numPoints; i++) {
      const point = path.getPointAtLength((i / numPoints) * length);
      points.push([point.x, point.y]);
    }

    return this.cleanPoints(points);
  }

  private cleanPoints(points: [number, number][]): [number, number][] {
    const minDistance = 0.00001;
    return points.filter((point, index, array) => {
      if (index === 0) return true;
      const prev = array[index - 1];
      const distance = Math.sqrt(
        Math.pow(point[0] - prev[0], 2) + Math.pow(point[1] - prev[1], 2)
      );
      return distance > minDistance;
    });
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
    const normalized = this.normalizeCoordinates(coords);
    if (normalized.length < 4) return normalized;

    try {
      const line = turf.lineString(normalized);
      const simplified = turf.simplify(line, {
        tolerance: 0.0001, // Reduced tolerance for more precise shapes
        highQuality: true,
        mutate: false,
      });

      const result = simplified.geometry.coordinates as [number, number][];
      return this.normalizeCoordinates(result);
    } catch (error) {
      console.warn('Error simplifying coordinates:', error);
      return normalized;
    }
  }

  private normalizeCoordinates(coords: [number, number][]): [number, number][] {
    const minDistance = 0.00001;
    const normalized = coords.filter((point, index, array) => {
      if (index === 0) return true;
      const prev = array[index - 1];
      const distance = Math.sqrt(
        Math.pow(point[0] - prev[0], 2) + Math.pow(point[1] - prev[1], 2)
      );
      return distance > minDistance;
    });

    if (normalized.length < 3) return [];

    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    const distance = Math.sqrt(
      Math.pow(first[0] - last[0], 2) + Math.pow(first[1] - last[1], 2)
    );

    if (distance > minDistance) {
      normalized.push([...first]);
    }

    return normalized;
  }

  private createValidPolygon(
    coords: [number, number][]
  ): Feature<Polygon> | null {
    try {
      if (coords.length < 4) return null;

      const polygon = turf.polygon([coords]);
      if (!turf.booleanValid(polygon)) {
        const buffered = turf.buffer(turf.lineString(coords), 0.000001, {
          // Reduced buffer size
          units: 'degrees',
          steps: 16, // Increased steps for smoother edges
        });

        if (!buffered) return null;

        const bufferedCoords = buffered.geometry.coordinates[0] as Position[];
        const simplified = turf.simplify(turf.polygon([bufferedCoords]), {
          tolerance: 0.0001,
          highQuality: true,
        });

        return simplified;
      }

      return polygon;
    } catch (error) {
      console.warn('Error creating polygon:', error);
      return null;
    }
  }
}
