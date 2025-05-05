// image-uploader.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageTracerService } from '../../services/image-tracer.service';
import { TraceOptions } from '../../services/interfaces';
import { GeoJSON } from 'geojson';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ImageUploaderComponent {
  @Output() geoJsonGenerated = new EventEmitter<GeoJSON>();
  @Output() tracingStarted = new EventEmitter<void>();
  @Output() tracingCompleted = new EventEmitter<void>();
  @Output() errorOccurred = new EventEmitter<string>();

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isTracing = false;

  // Configuration options for the tracing
  traceOptions: TraceOptions = {
    color: '#000000',
    threshold: 120,
    turdSize: 10,
    turnPolicy: 'minority',
  };

  constructor(private imageTracer: ImageTracerService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async processImage(): Promise<void> {
    if (!this.selectedFile) return;

    this.isTracing = true;
    this.tracingStarted.emit();

    try {
      const geoJson = await this.imageTracer.convertImageToGeoJson(
        this.selectedFile,
        this.traceOptions
      );
      this.geoJsonGenerated.emit(geoJson);
    } catch (error) {
      console.error('Image tracing failed:', error);
      this.errorOccurred.emit(
        'Failed to process image. Please try another image.'
      );
    } finally {
      this.isTracing = false;
      this.tracingCompleted.emit();
    }
  }
}
