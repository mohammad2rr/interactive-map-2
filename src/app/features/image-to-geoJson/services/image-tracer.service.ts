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

    // Increased sampling density for better detail preservation
    const baseSamples = Math.max(1000, Math.ceil(length * 2));
    let prevPoint = pathProps.getPointAtLength(0);
    let prevTangent = pathProps.getTangentAtLength(0);
    points.push([prevPoint.x, prevPoint.y]);

    let accumulatedAngle = 0;
    let lastAddedPoint = prevPoint;

    for (let i = 1; i <= baseSamples; i++) {
      const t = (i / baseSamples) * length;
      const point = pathProps.getPointAtLength(t);
      const tangent = pathProps.getTangentAtLength(t);

      // Enhanced curvature detection
      const angle = Math.atan2(tangent.y, tangent.x);
      const prevAngle = Math.atan2(prevTangent.y, prevTangent.x);
      let angleDiff = Math.abs(angle - prevAngle);
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
      }
      accumulatedAngle += angleDiff;

      // Distance from last added point
      const distanceFromLast = Math.hypot(
        point.x - lastAddedPoint.x,
        point.y - lastAddedPoint.y
      );

      // Add points based on refined criteria
      if (
        i === baseSamples ||
        angleDiff > 0.01 || // More sensitive angle detection
        distanceFromLast > 0.5 || // Smaller distance threshold
        accumulatedAngle > 0.05
      ) {
        // More frequent updates

        points.push([point.x, point.y]);
        lastAddedPoint = point;
        prevTangent = tangent;
        accumulatedAngle = 0;
      }
    }

    // Ensure proper path closure
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const closeDistance = Math.hypot(
      lastPoint[0] - firstPoint[0],
      lastPoint[1] - firstPoint[1]
    );

    if (closeDistance > 0.1) {
      // Only close if actually needed
      points.push([...firstPoint]);
    }

    return points;
  }

  private cleanPoints(points: [number, number][]): [number, number][] {
    if (points.length < 3) return points;

    const cleaned: [number, number][] = [];
    const minDistance = 0.3; // Reduced for better detail
    const angleThreshold = 0.03; // More sensitive angle detection

    cleaned.push(points[0]);

    for (let i = 1; i < points.length - 1; i++) {
      const prev = cleaned[cleaned.length - 1];
      const curr = points[i];
      const next = points[i + 1];

      const d1 = this.getDistance(curr, prev);
      const d2 = this.getDistance(next, curr);

      const angle = Math.abs(
        Math.atan2(next[1] - curr[1], next[0] - curr[0]) -
          Math.atan2(curr[1] - prev[1], curr[0] - prev[0])
      );

      // Enhanced point selection criteria
      const isSignificantCurve = angle > angleThreshold;
      const isDetailPoint =
        d1 < minDistance * 2 &&
        d2 < minDistance * 2 &&
        angle > angleThreshold / 2;
      const isLongSegment = d1 > minDistance || d2 > minDistance;
      const isEndPoint = i === points.length - 2;

      if (isSignificantCurve || isDetailPoint || isLongSegment || isEndPoint) {
        cleaned.push(curr);
      }
    }

    const last = points[points.length - 1];
    const distanceToFirst = this.getDistance(last, cleaned[0]);

    if (distanceToFirst > minDistance / 3) {
      cleaned.push(last);
    }

    // Ensure proper closure
    if (
      !this.pointsMatch(
        cleaned[0],
        cleaned[cleaned.length - 1],
        minDistance / 3
      )
    ) {
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
        // Refined multi-pass simplification with gentler tolerances
        let simplified = turf.simplify(polygon, {
          tolerance: 0.0004, // Reduced tolerance
          highQuality: true,
        });

        // Final refinement pass
        simplified = turf.simplify(simplified, {
          tolerance: 0.0002,
          highQuality: true,
        });

        return this.smoothPolygon(simplified);
      }

      // Enhanced polygon repair for invalid shapes
      const line = turf.lineString(coords);
      const buffered = turf.buffer(line, 0.0000001, {
        // Reduced buffer size
        units: 'degrees',
        steps: 360, // Increased steps for smoother edges
      });

      if (!buffered) return null;

      // Process buffered result
      const coordinates = buffered.geometry.coordinates as Position[][];
      let bestPolygon: Position[] | null = null;
      let bestScore = -1;

      for (const poly of coordinates) {
        const polygonFeature = turf.polygon([poly as Position[]]);
        const area = Math.abs(turf.area(polygonFeature));
        const perimeter = turf.length(turf.lineString(poly as Position[]));
        const score = (4 * Math.PI * area) / (perimeter * perimeter);

        if (score > bestScore) {
          bestScore = score;
          bestPolygon = poly as Position[];
        }
      }

      if (!bestPolygon) return null;

      let final = turf.polygon([bestPolygon]);
      final = turf.simplify(final, {
        tolerance: 0.00002, // Further reduced tolerance
        highQuality: true,
      });

      return this.smoothPolygon(final);
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

      // Set canvas size to match image
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Enhanced image preprocessing pipeline
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Advanced multi-stage image processing
      this.ctx.filter = 'contrast(150%) brightness(105%) saturate(120%)';
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.filter = 'none';

      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      const { data: pixels, width, height } = imageData;

      // Enhanced grayscale conversion with better color weighting
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // Using improved color weights for better detail preservation
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
      }

      // Improved adaptive thresholding
      const blockSize = 11; // Reduced block size for finer detail
      const C = 3; // Reduced constant for more sensitivity

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          let sum = 0;
          let count = 0;

          // Calculate local mean with weighted sampling
          for (let dy = -blockSize; dy <= blockSize; dy++) {
            for (let dx = -blockSize; dx <= blockSize; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                // Weight samples based on distance
                const weight = 1 / (1 + Math.sqrt(dx * dx + dy * dy));
                sum += pixels[(ny * width + nx) * 4] * weight;
                count += weight;
              }
            }
          }

          const threshold = sum / count - C;
          pixels[idx] =
            pixels[idx + 1] =
            pixels[idx + 2] =
              pixels[idx] < threshold ? 0 : 255;
        }
      }

      this.ctx.putImageData(imageData, 0, 0);

      // Enhanced Potrace options for better detail preservation
      const traceOptions: PotraceOptions = {
        color: options.color || '#000000',
        background: '#ffffff',
        threshold: options.threshold !== undefined ? options.threshold : 128,
        turdSize: options.turdSize || 2, // Reduced for better detail
        alphaMax: 0.1, // Reduced for smoother curves
        turnPolicy: 'black',
        optCurve: true,
        optTolerance: 0.1,
      };

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
    if (!pathData.trim().endsWith('Z')) {
      pathData = pathData.trim() + ' Z';
    }
    // Remove any double spaces and normalize commands
    return pathData
      .replace(/([MmLlHhVvCcSsQqTtAa])\s*/g, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
