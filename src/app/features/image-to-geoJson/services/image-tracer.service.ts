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
import { TraceOptions, FeatureProperties } from './interfaces';

interface PotraceOptions {
  color?: string;
  background?: string | undefined;
  threshold?: number;
  turdSize?: number;
  turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
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
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
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

      // Set canvas dimensions
      const maxDimension = 1000; // To prevent huge files
      const ratio = Math.min(
        maxDimension / img.width,
        maxDimension / img.height
      );
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const traceOptions: PotraceOptions = {
        color: options.color || '#000000',
        threshold: options.threshold !== undefined ? options.threshold : 120,
        turdSize: options.turdSize || 10,
        turnPolicy: options.turnPolicy || 'minority',
        background: options.background || undefined,
      };

      // Convert canvas to data URL and trace
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

  private normalizeCoordinates(coords: [number, number][]): [number, number][] {
    // Filter out points that are too close together
    const minDistance = 0.00001;
    const normalized = coords.filter((point, index, array) => {
      if (index === 0) return true;
      const prev = array[index - 1];
      const distance = Math.sqrt(
        Math.pow(point[0] - prev[0], 2) + Math.pow(point[1] - prev[1], 2)
      );
      return distance > minDistance;
    });

    // Ensure we have enough points
    if (normalized.length < 3) {
      return [];
    }

    // Check if the polygon is closed
    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    const distance = Math.sqrt(
      Math.pow(first[0] - last[0], 2) + Math.pow(first[1] - last[1], 2)
    );

    // Close the polygon if needed
    if (distance > minDistance) {
      normalized.push([...first]);
    }

    return normalized;
  }

  private cleanCoordinates(coords: [number, number][]): [number, number][] {
    const normalized = this.normalizeCoordinates(coords);
    if (normalized.length < 4) return normalized;

    try {
      // Create a line string and simplify with a small tolerance
      const line = turf.lineString(normalized);
      const simplified = turf.simplify(line, {
        tolerance: 0.01,
        highQuality: true,
        mutate: false,
      });

      // Get coordinates and ensure they're still valid
      const result = simplified.geometry.coordinates as [number, number][];
      return this.normalizeCoordinates(result);
    } catch (error) {
      console.warn('Error simplifying coordinates:', error);
      return normalized;
    }
  }

  private createValidPolygon(
    coords: [number, number][]
  ): Feature<Polygon> | null {
    try {
      // Check if we have enough points
      if (coords.length < 4) {
        return null;
      }

      // Create polygon with single ring
      const polygon = turf.polygon([coords]);

      // Validate the polygon
      if (!turf.booleanValid(polygon)) {
        // Try to fix using buffer technique
        const buffered = turf.buffer(turf.lineString(coords), 0.00001, {
          units: 'degrees',
          steps: 8,
        });

        if (!buffered) return null;

        // Get the largest polygon if multiple were created
        const polys = turf.explode(buffered);
        const hull = turf.convex(polys);

        if (hull && turf.booleanValid(hull)) {
          return hull;
        }
      } else {
        return polygon;
      }
    } catch (error) {
      console.warn('Error creating polygon:', error);
    }
    return null;
  }

  private async convertSvgToGeoJson(svg: string): Promise<GeoJSON> {
    const svgJson = await svgson.parse(svg);
    const paths = this.extractPaths(svgJson);

    const features = paths
      .map((path, index) => {
        try {
          // Get coordinates from SVG path
          const coordinates = this.parseSvgPath(path.d);
          if (!coordinates || coordinates.length < 3) return null;

          // Clean and normalize coordinates
          const cleanedCoords = this.cleanCoordinates(coordinates);
          if (cleanedCoords.length < 4) return null;

          // Create valid polygon
          const polygon = this.createValidPolygon(cleanedCoords);
          if (!polygon) return null;

          // Return feature with properties
          return {
            type: 'Feature',
            properties: {
              id: `shape-${index}`,
              stroke: path.stroke || '#000000',
              fill: path.fill || 'none',
              strokeWidth: path['stroke-width'] || 1,
            },
            geometry: polygon.geometry,
          };
        } catch (error) {
          console.warn(`Error processing path at index ${index}:`, error);
          return null;
        }
      })
      .filter(
        (feature): feature is Feature<Polygon, FeatureProperties> =>
          feature !== null
      );

    if (features.length === 0) {
      throw new Error('No valid features could be created from the SVG');
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  private createFeature(
    geometry: Polygon,
    path: any,
    index: number
  ): Feature<Polygon, FeatureProperties> {
    return {
      type: 'Feature',
      properties: {
        id: `shape-${index}`,
        stroke: path.stroke || '#000000',
        fill: path.fill || 'none',
        strokeWidth: path['stroke-width'] || 1,
      },
      geometry,
    };
  }

  private extractPaths(svgJson: any): any[] {
    const paths: any[] = [];

    const extract = (node: any) => {
      if (node.name === 'path') {
        paths.push(node.attributes);
      }
      if (node.children) {
        node.children.forEach(extract);
      }
    };

    extract(svgJson);
    return paths;
  }

  private parseSvgPath(pathData: string): [number, number][] {
    const commands = pathData.split(/(?=[A-Za-z])/);
    const points: [number, number][] = [];
    let currentPoint: [number, number] = [0, 0];

    commands.forEach((cmd) => {
      const type = cmd[0];
      const args = cmd
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .filter((s) => s !== '')
        .map(parseFloat);

      switch (type) {
        case 'M': // Move to (absolute)
          for (let i = 0; i < args.length; i += 2) {
            currentPoint = [args[i], args[i + 1]];
            points.push([...currentPoint]);
          }
          break;
        case 'm': // Move to (relative)
          for (let i = 0; i < args.length; i += 2) {
            currentPoint = [
              currentPoint[0] + args[i],
              currentPoint[1] + args[i + 1],
            ];
            points.push([...currentPoint]);
          }
          break;
        case 'L': // Line to (absolute)
          for (let i = 0; i < args.length; i += 2) {
            currentPoint = [args[i], args[i + 1]];
            points.push([...currentPoint]);
          }
          break;
        case 'l': // Line to (relative)
          for (let i = 0; i < args.length; i += 2) {
            currentPoint = [
              currentPoint[0] + args[i],
              currentPoint[1] + args[i + 1],
            ];
            points.push([...currentPoint]);
          }
          break;
        case 'H': // Horizontal line to (absolute)
          for (let i = 0; i < args.length; i++) {
            currentPoint = [args[i], currentPoint[1]];
            points.push([...currentPoint]);
          }
          break;
        case 'h': // Horizontal line to (relative)
          for (let i = 0; i < args.length; i++) {
            currentPoint = [currentPoint[0] + args[i], currentPoint[1]];
            points.push([...currentPoint]);
          }
          break;
        case 'V': // Vertical line to (absolute)
          for (let i = 0; i < args.length; i++) {
            currentPoint = [currentPoint[0], args[i]];
            points.push([...currentPoint]);
          }
          break;
        case 'v': // Vertical line to (relative)
          for (let i = 0; i < args.length; i++) {
            currentPoint = [currentPoint[0], currentPoint[1] + args[i]];
            points.push([...currentPoint]);
          }
          break;
        case 'C': // Cubic Bezier curve (absolute)
          for (let i = 0; i < args.length; i += 6) {
            // Add the end point of the curve
            currentPoint = [args[i + 4], args[i + 5]];
            points.push([...currentPoint]);
          }
          break;
        case 'c': // Cubic Bezier curve (relative)
          for (let i = 0; i < args.length; i += 6) {
            // Add the end point of the curve
            currentPoint = [
              currentPoint[0] + args[i + 4],
              currentPoint[1] + args[i + 5],
            ];
            points.push([...currentPoint]);
          }
          break;
        case 'Z': // Close path
        case 'z': // Close path
          if (points.length > 0) {
            // Only add closing point if it's different from the last point
            const firstPoint = points[0];
            const lastPoint = points[points.length - 1];
            if (
              firstPoint[0] !== lastPoint[0] ||
              firstPoint[1] !== lastPoint[1]
            ) {
              points.push([...firstPoint]);
            }
          }
          break;
        default:
          console.warn(`Unsupported SVG path command: ${type}`);
      }
    });

    // Remove consecutive duplicate points
    return points.filter((point, index, array) => {
      if (index === 0) return true;
      const prevPoint = array[index - 1];
      return !(point[0] === prevPoint[0] && point[1] === prevPoint[1]);
    });
  }
}
