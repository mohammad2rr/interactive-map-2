// image-tracer.service.ts
import { Injectable } from '@angular/core';
import {
  Feature,
  GeoJSON,
  Geometry,
  FeatureCollection,
  Polygon,
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

  private async convertSvgToGeoJson(svg: string): Promise<GeoJSON> {
    // Parse SVG to JSON
    const svgJson = await svgson.parse(svg);

    // Extract paths from SVG
    const paths = this.extractPaths(svgJson);

    // Convert paths to GeoJSON features with validation
    const features = paths
      .map((path, index) => {
        try {
          const coordinates = this.parseSvgPath(path.d);
          if (!coordinates || coordinates.length < 3) return null;

          // Check if the polygon is closed
          const firstPoint = coordinates[0];
          const lastPoint = coordinates[coordinates.length - 1];
          if (
            firstPoint[0] !== lastPoint[0] ||
            firstPoint[1] !== lastPoint[1]
          ) {
            coordinates.push([...firstPoint]); // Close the polygon
          }

          // Create and validate polygon
          const polygon = turf.polygon([coordinates]);
          if (!turf.booleanValid(polygon)) {
            console.warn(
              `Invalid polygon at index ${index}, attempting to fix...`
            );
            const fixed = turf.unkinkPolygon(polygon);
            if (fixed.features.length > 0) {
              const feature: Feature<Polygon, FeatureProperties> = {
                type: 'Feature',
                properties: {
                  id: `shape-${index}`,
                  stroke: path.stroke || '#000000',
                  fill: path.fill || 'none',
                  strokeWidth: path['stroke-width'] || 1,
                },
                geometry: fixed.features[0].geometry as Polygon,
              };
              return feature;
            }
            return null;
          }

          const feature: Feature<Polygon, FeatureProperties> = {
            type: 'Feature',
            properties: {
              id: `shape-${index}`,
              stroke: path.stroke || '#000000',
              fill: path.fill || 'none',
              strokeWidth: path['stroke-width'] || 1,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [coordinates],
            },
          };
          return feature;
        } catch (error) {
          console.warn(`Error processing path at index ${index}:`, error);
          return null;
        }
      })
      .filter(
        (feature): feature is Feature<Polygon, FeatureProperties> =>
          feature !== null
      );

    // Create and validate the FeatureCollection
    const featureCollection: FeatureCollection<Polygon, FeatureProperties> = {
      type: 'FeatureCollection',
      features,
    };

    // Validate each feature individually since turf.booleanValid doesn't handle FeatureCollections well
    const invalidFeatures = features.filter(
      (feature) => !turf.booleanValid(feature.geometry)
    );
    if (invalidFeatures.length > 0) {
      throw new Error('Some features in the GeoJSON are invalid');
    }

    return featureCollection;
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
            points.push(currentPoint);
          }
          break;
        case 'm': // Move to (relative)
          for (let i = 0; i < args.length; i += 2) {
            currentPoint = [
              currentPoint[0] + args[i],
              currentPoint[1] + args[i + 1],
            ];
            points.push(currentPoint);
          }
          break;
        case 'L': // Line to (absolute)
        case 'H': // Horizontal line to (absolute)
        case 'V': // Vertical line to (absolute)
          for (let i = 0; i < args.length; i++) {
            if (type === 'H') {
              currentPoint = [args[i], currentPoint[1]];
            } else if (type === 'V') {
              currentPoint = [currentPoint[0], args[i]];
            } else {
              currentPoint = [args[i], args[i + 1]];
              i++; // Skip next arg as we used two args
            }
            points.push(currentPoint);
          }
          break;
        case 'l': // Line to (relative)
        case 'h': // Horizontal line to (relative)
        case 'v': // Vertical line to (relative)
          for (let i = 0; i < args.length; i++) {
            if (type === 'h') {
              currentPoint = [currentPoint[0] + args[i], currentPoint[1]];
            } else if (type === 'v') {
              currentPoint = [currentPoint[0], currentPoint[1] + args[i]];
            } else {
              currentPoint = [
                currentPoint[0] + args[i],
                currentPoint[1] + args[i + 1],
              ];
              i++; // Skip next arg as we used two args
            }
            points.push(currentPoint);
          }
          break;
        case 'Z': // Close path
        case 'z': // Close path
          if (points.length > 0) {
            points.push([...points[0]]); // Return to first point
          }
          break;
        default:
          console.warn(`Unsupported SVG path command: ${type}`);
      }
    });

    return points;
  }
}
