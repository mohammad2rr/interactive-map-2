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
    const minPoints = 100;
    const maxPoints = 500;
    const stepSize = Math.max(length / maxPoints, 1);
    let currentLength = 0;

    // Sample points along the path at variable intervals
    while (currentLength <= length) {
      const point = path.getPointAtLength(currentLength);
      // Only add point if it's significantly different from the last point
      if (
        points.length === 0 ||
        Math.hypot(
          point.x - points[points.length - 1][0],
          point.y - points[points.length - 1][1]
        ) > 0.5
      ) {
        points.push([point.x, point.y]);
      }
      currentLength += stepSize;
    }

    // Ensure we always include the last point
    const lastPoint = path.getPointAtLength(length);
    points.push([lastPoint.x, lastPoint.y]);

    return this.cleanPoints(points);
  }

  private cleanPoints(points: [number, number][]): [number, number][] {
    if (points.length < 3) return points;

    const cleaned: [number, number][] = [];
    const minDistance = 1.0; // Increased threshold for point filtering

    // Keep first point
    cleaned.push(points[0]);

    // Filter middle points based on distance and angle
    for (let i = 1; i < points.length - 1; i++) {
      const prev = cleaned[cleaned.length - 1];
      const curr = points[i];
      const next = points[i + 1];

      // Calculate distances
      const d1 = Math.hypot(curr[0] - prev[0], curr[1] - prev[1]);
      const d2 = Math.hypot(next[0] - curr[0], next[1] - curr[1]);

      // Calculate angle between segments
      const angle = Math.abs(
        Math.atan2(next[1] - curr[1], next[0] - curr[0]) -
          Math.atan2(curr[1] - prev[1], curr[0] - prev[0])
      );

      // Keep point if it represents a significant change in direction or distance
      if (d1 > minDistance && (angle > 0.1 || d2 > minDistance * 2)) {
        cleaned.push(curr);
      }
    }

    // Keep last point and ensure the shape is closed
    const last = points[points.length - 1];
    if (
      Math.hypot(last[0] - cleaned[0][0], last[1] - cleaned[0][1]) > minDistance
    ) {
      cleaned.push(last);
    }
    if (!this.pointsMatch(cleaned[0], cleaned[cleaned.length - 1])) {
      cleaned.push([...cleaned[0]]);
    }

    return cleaned;
  }

  private pointsMatch(
    p1: [number, number],
    p2: [number, number],
    threshold = 0.1
  ): boolean {
    return (
      Math.abs(p1[0] - p2[0]) < threshold && Math.abs(p1[1] - p2[1]) < threshold
    );
  }

  private cleanCoordinates(coords: [number, number][]): [number, number][] {
    if (coords.length < 4) return coords;

    // First pass: Remove redundant points
    let simplified = coords.filter((point, index, array) => {
      if (index === 0) return true;
      const prev = array[index - 1];
      return !this.pointsMatch(point, prev);
    });

    // Ensure minimum number of points for a valid polygon
    if (simplified.length < 4) {
      return coords;
    }

    try {
      // Use turf.js for advanced simplification
      const line = turf.lineString(simplified);
      const simplifiedGeoJson = turf.simplify(line, {
        tolerance: 0.001,
        highQuality: true,
        mutate: false,
      });

      simplified = simplifiedGeoJson.geometry.coordinates as [number, number][];

      // Ensure the polygon is properly closed
      if (!this.pointsMatch(simplified[0], simplified[simplified.length - 1])) {
        simplified.push([...simplified[0]]);
      }

      return simplified;
    } catch (error) {
      console.warn('Error in coordinate simplification:', error);
      return simplified;
    }
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
        const last =
          simplified.geometry.coordinates[0][
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
