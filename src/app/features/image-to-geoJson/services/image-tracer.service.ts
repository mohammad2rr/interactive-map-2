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
import * as turf from '@turf/turf';
import { svgPathProperties } from 'svg-path-properties';
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
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
  }

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
      offsetY: viewBox ? viewBox[3] : height,
    };

    const paths = Array.from(doc.querySelectorAll('path'));
    const features = await Promise.all(
      paths.map(async (path, index) => {
        try {
          const d = path.getAttribute('d');
          if (!d) return null;

          // Parse SVG path and convert to points
          const points = this.parseSvgPath(d);
          if (points.length < 3) return null;

          // Scale and transform points
          const scaledPoints = points.map(
            ([x, y]) =>
              [x * scale.x + scale.offsetX, scale.offsetY - y * scale.y] as [
                number,
                number
              ]
          );

          // Clean and validate coordinates
          const cleanedPoints = this.cleanPoints(scaledPoints);
          if (cleanedPoints.length < 4) return null;

          // Create and validate polygon
          const polygon = this.createValidPolygon(cleanedPoints);
          if (!polygon) return null;

          // Create feature with properties
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

          return feature;
        } catch (error) {
          console.error('Error processing path:', error);
          return null;
        }
      })
    );

    // Filter valid features
    const validFeatures = features.filter((f): f is GeoJsonFeature => {
      if (!f) return false;
      try {
        return turf.booleanValid(turf.feature(f.geometry));
      } catch {
        return false;
      }
    });

    const geoJson: FeatureCollection<Polygon, GeoJsonFeatureProperties> = {
      type: 'FeatureCollection',
      features: validFeatures,
    };

    return geoJson;
  }

  private parseSvgPath(pathData: string): [number, number][] {
    const pathProps = new svgPathProperties(pathData);
    const length = pathProps.getTotalLength();
    const points: [number, number][] = [];

    // More dense sampling for better detail
    const baseSamples = Math.max(500, Math.ceil(length));
    let prevPoint = pathProps.getPointAtLength(0);
    let prevTangent = pathProps.getTangentAtLength(0);
    points.push([prevPoint.x, prevPoint.y]);

    let accumulatedAngle = 0;

    for (let i = 1; i <= baseSamples; i++) {
      const t = (i / baseSamples) * length;
      const point = pathProps.getPointAtLength(t);
      const tangent = pathProps.getTangentAtLength(t);

      // Enhanced curvature detection
      const angle = Math.atan2(tangent.y, tangent.x);
      const prevAngle = Math.atan2(prevTangent.y, prevTangent.x);
      const angleDiff = Math.abs(angle - prevAngle);
      accumulatedAngle += angleDiff;

      // Add points based on enhanced criteria
      const distance = Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y);
      if (
        i === baseSamples ||
        angleDiff > 0.02 ||
        distance > 1.0 ||
        accumulatedAngle > 0.1
      ) {
        points.push([point.x, point.y]);
        prevPoint = point;
        prevTangent = tangent;
        accumulatedAngle = 0;
      }
    }

    // Ensure the path is closed properly
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    if (!this.pointsMatch(firstPoint, lastPoint)) {
      points.push([...firstPoint]);
    }

    return points;
  }

  private cleanPoints(points: [number, number][]): [number, number][] {
    if (points.length < 3) return points;

    const cleaned: [number, number][] = [];
    const minDistance = 1.5; // Reduced for better detail preservation
    const angleThreshold = 0.08; // Reduced for smoother curves

    // Keep first point
    cleaned.push(points[0]);

    // Adaptive point filtering based on local curvature
    for (let i = 1; i < points.length - 1; i++) {
      const prev = cleaned[cleaned.length - 1];
      const curr = points[i];
      const next = points[i + 1];

      const d1 = this.getDistance(curr, prev);
      const d2 = this.getDistance(next, curr);

      // Calculate local curvature using three points
      const angle = Math.abs(
        Math.atan2(next[1] - curr[1], next[0] - curr[0]) -
          Math.atan2(curr[1] - prev[1], curr[0] - prev[0])
      );

      // Keep points that represent significant shape features
      const isSignificantCurve = angle > angleThreshold;
      const isLongSegment = d1 > minDistance * 2 || d2 > minDistance * 2;
      const isEndPoint = i === points.length - 2;

      if (isSignificantCurve || isLongSegment || isEndPoint) {
        cleaned.push(curr);
      }
    }

    // Ensure proper closure with smooth connection
    const last = points[points.length - 1];
    const distanceToFirst = this.getDistance(last, cleaned[0]);

    if (distanceToFirst > minDistance / 2) {
      cleaned.push(last);
    }

    if (!this.pointsMatch(cleaned[0], cleaned[cleaned.length - 1])) {
      cleaned.push([...cleaned[0]]);
    }

    return cleaned;
  }

  private getDistance(p1: [number, number], p2: [number, number]): number {
    return Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
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

  private createValidPolygon(
    coords: [number, number][]
  ): Feature<Polygon> | null {
    try {
      if (coords.length < 4) return null;

      // Create initial polygon
      const polygon = turf.polygon([coords]);

      if (turf.booleanValid(polygon)) {
        // Multi-pass simplification with progressively finer tolerances
        let simplified = turf.simplify(polygon, {
          tolerance: 0.0008,
          highQuality: true,
        });

        simplified = turf.simplify(simplified, {
          tolerance: 0.0004,
          highQuality: true,
        });

        // Final pass with very fine tolerance for detail preservation
        simplified = turf.simplify(simplified, {
          tolerance: 0.0002,
          highQuality: true,
        });

        return simplified;
      }

      // Enhanced polygon repair for invalid shapes
      const line = turf.lineString(coords);
      const buffered = turf.buffer(line, 0.0000005, {
        units: 'degrees',
        steps: 180, // Increased for smoother edges
      });

      if (!buffered) return null;

      // Process buffered result to get the best shape
      const coordinates = buffered.geometry.coordinates as Position[][];
      let bestPolygon: Position[] | null = null;
      let bestScore = -1;

      for (const poly of coordinates) {
        const polygonFeature = turf.polygon([poly as Position[]]);
        const area = Math.abs(turf.area(polygonFeature));
        const perimeter = turf.length(turf.lineString(poly as Position[]));
        // Calculate shape compactness score
        const score = (4 * Math.PI * area) / (perimeter * perimeter);

        if (score > bestScore) {
          bestScore = score;
          bestPolygon = poly as Position[];
        }
      }

      if (!bestPolygon) return null;

      // Create final shape with progressive refinement
      let final = turf.polygon([bestPolygon]);
      final = turf.simplify(final, {
        tolerance: 0.00004,
        highQuality: true,
      });

      // Smooth the final shape
      const smoothed = this.smoothPolygon(final);
      return smoothed;
    } catch (error) {
      console.warn('Error creating polygon:', error);
      return null;
    }
  }

  private smoothPolygon(polygon: Feature<Polygon>): Feature<Polygon> {
    try {
      const coords = polygon.geometry.coordinates[0];
      const smoothedCoords: Position[] = [];
      const smoothingFactor = 0.2;

      for (let i = 0; i < coords.length; i++) {
        const prev = coords[(i - 1 + coords.length) % coords.length];
        const curr = coords[i];
        const next = coords[(i + 1) % coords.length];

        // Calculate smoothed point using Chaikin's algorithm
        const x = curr[0] + smoothingFactor * (prev[0] + next[0] - 2 * curr[0]);
        const y = curr[1] + smoothingFactor * (prev[1] + next[1] - 2 * curr[1]);

        smoothedCoords.push([x, y]);
      }

      // Ensure closure
      smoothedCoords.push([...smoothedCoords[0]]);

      return turf.polygon([smoothedCoords]);
    } catch (error) {
      console.warn('Error smoothing polygon:', error);
      return polygon;
    }
  }

  private traceImageToSvg(
    img: HTMLImageElement,
    options: TraceOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
      }

      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Enhanced image preprocessing
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Improved contrast and edge detection
      this.ctx.filter = 'contrast(150%) brightness(110%)';
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.filter = 'none';

      // Enhanced Potrace options for better detail preservation
      const traceOptions: PotraceOptions = {
        color: options.color || '#000000',
        background: '#ffffff',
        threshold: options.threshold !== undefined ? options.threshold : 120, // Lowered threshold for finer details
        turdSize: options.turdSize || 2, // Reduced to capture smaller features
        alphaMax: 0.1, // Increased for smoother curves
        turnPolicy: 'minority', // Better for complex shapes
        optCurve: true,
        optTolerance: 0.2, // Increased for better curve fitting
      };

      // Process image with enhanced grayscale conversion
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // Enhanced grayscale with better edge detection
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
      }

      this.ctx.putImageData(imageData, 0, 0);
      const imageDataUrl = this.canvas.toDataURL('image/png');

      potrace.trace(
        imageDataUrl,
        traceOptions,
        (err: Error | null, svg: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(this.ensureClosedPath(svg));
          }
        }
      );
    });
  }

  private ensureClosedPath(pathData: string): string {
    // Ensure path is properly closed
    if (!pathData.trim().endsWith('Z')) {
      pathData = pathData.trim() + ' Z';
    }
    // Remove any double spaces and normalize commands
    return pathData
      .replace(/\s+/g, ' ')
      .replace(/([MmLlHhVvCcSsQqTtAa])\s*/g, ' $1 ')
      .trim();
  }
}
