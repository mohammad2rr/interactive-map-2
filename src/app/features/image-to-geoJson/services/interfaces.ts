// Create a new file interfaces.ts
export interface TraceOptions {
  color?: string;
  threshold?: number;
  turdSize?: number;
  turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
  background?: string | null;
}

export interface FeatureProperties {
  id: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  [key: string]: any;
}
