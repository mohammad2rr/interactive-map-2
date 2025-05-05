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

  private async convertSvgToGeoJson(svg: string): Promise<GeoJSON> {
    const svgJson = await svgson.parse(svg);
    const paths = this.extractPaths(svgJson);

    const features = paths
      .map((path, index) => {
        try {
          const coordinates = this.parseSvgPath(path.d);
          if (!coordinates || coordinates.length < 3) return null;

          const cleanedCoords = this.cleanCoordinates(coordinates);
          if (cleanedCoords.length < 3) return null;

          try {
            // Try to create a valid polygon
            let polygon = turf.polygon([[...cleanedCoords]]);

            // If the polygon is valid, use it directly
            if (turf.booleanValid(polygon)) {
              return this.createFeature(
                polygon.geometry as Polygon,
                path,
                index
              );
            }

            // If invalid, try to fix with buffer and unbuffer technique
            console.warn(
              `Invalid polygon at index ${index}, attempting to fix...`
            );

            // Create a small buffer around the invalid polygon
            const buffered = turf.buffer(
              turf.lineString(cleanedCoords),
              0.000001,
              {
                units: 'degrees',
              }
            );

            if (!buffered) return null;

            // Get the coordinates of the largest polygon from the buffer
            const coords = buffered.geometry.coordinates[0][0];
            polygon = turf.polygon([coords as Position[]]);

            // Validate the fixed polygon
            if (turf.booleanValid(polygon)) {
              return this.createFeature(
                polygon.geometry as Polygon,
                path,
                index
              );
            }

            // If still invalid, try unkinkPolygon as last resort
            const fixed = turf.unkinkPolygon(polygon);
            if (fixed.features.length > 0) {
              // Get the largest polygon from the fixed features
              let largestArea = 0;
              let largestFeature = fixed.features[0];

              fixed.features.forEach((feature) => {
                const area = turf.area(feature);
                if (area > largestArea) {
                  largestArea = area;
                  largestFeature = feature;
                }
              });

              return this.createFeature(
                largestFeature.geometry as Polygon,
                path,
                index
              );
            }
          } catch (error) {
            console.warn(`Error creating polygon at index ${index}:`, error);
          }
          return null;
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

  private cleanCoordinates(coords: [number, number][]): [number, number][] {
    if (coords.length < 3) return coords;

    // First remove consecutive duplicates with higher precision
    const withoutDuplicates = coords.filter((point, index, array) => {
      if (index === 0) return true;
      const prevPoint = array[index - 1];
      return !(
        Math.abs(point[0] - prevPoint[0]) < 0.0000001 &&
        Math.abs(point[1] - prevPoint[1]) < 0.0000001
      );
    });

    // Ensure minimum points for a polygon
    if (withoutDuplicates.length < 3) return withoutDuplicates;

    try {
      // Create a proper ring by ensuring first and last points match
      const ring = [...withoutDuplicates];
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];

      if (
        Math.abs(firstPoint[0] - lastPoint[0]) > 0.0000001 ||
        Math.abs(firstPoint[1] - lastPoint[1]) > 0.0000001
      ) {
        ring.push([...firstPoint]);
      }

      // Simplify with turf, but preserve topology
      const line = turf.lineString(ring);
      const simplified = turf.simplify(line, {
        tolerance: 0.1,
        highQuality: true,
        mutate: false,
      });

      const simplifiedCoords = simplified.geometry.coordinates as [
        number,
        number
      ][];

      // Ensure we still have a valid polygon
      return simplifiedCoords.length >= 3 ? simplifiedCoords : ring;
    } catch (error) {
      console.warn('Error simplifying coordinates:', error);
      return withoutDuplicates;
    }
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
