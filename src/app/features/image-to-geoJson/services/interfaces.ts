// Create a new file interfaces.ts
export interface FeatureProperties {
  id: string;
  stroke: string;
  fill: string;
  strokeWidth: number;
  transform: string | null;
  style: string | null;
}

export interface TraceOptions {
  color?: string;
  threshold?: number;
  turdSize?: number;
  turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
  background?: string | null;
}

export interface SvgScale {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
