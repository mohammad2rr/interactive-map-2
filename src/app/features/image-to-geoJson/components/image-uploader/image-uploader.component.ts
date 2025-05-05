// image-uploader.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterModule,
  Router,
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { ImageTracerService } from '../../services/image-tracer.service';
import { GeoJsonStateService } from '../../services/geo-json-state.service';
import { TraceOptions } from '../../services/interfaces';
import { GeoJSON } from 'geojson';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet],
})
export class ImageUploaderComponent implements OnInit {
  @Output() geoJsonGenerated = new EventEmitter<GeoJSON>();
  @Output() tracingStarted = new EventEmitter<void>();
  @Output() tracingCompleted = new EventEmitter<void>();
  @Output() errorOccurred = new EventEmitter<string>();

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isTracing = false;
  geoJsonData: GeoJSON | null = null;

  // Configuration options for the tracing
  traceOptions: TraceOptions = {
    color: '#000000',
    threshold: 128,  // More balanced threshold
    turdSize: 30,   // Higher turdSize to remove small artifacts
    turnPolicy: 'black',  // Changed to 'black' for better shape detection
    background: '#ffffff'  // Explicit white background
  };

  constructor(
    private imageTracer: ImageTracerService,
    private router: Router,
    private route: ActivatedRoute,
    private geoJsonState: GeoJsonStateService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    // Component initialization logic
  }

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
      this.geoJsonState.updateGeoJsonData(geoJson);
      this.geoJsonGenerated.emit(geoJson);

      // Navigate to editor and preview using named outlets
      await this.router.navigate(
        [
          {
            outlets: {
              primary: ['editor'],
              preview: ['preview'],
            },
          },
        ],
        { relativeTo: this.route }
      );
    } catch (error) {
      console.error('Image tracing failed:', error);
      this.errorOccurred.emit(
        `Failed to process image. ${(error as any).message || 'Please try another image.'}`
      );
    } finally {
      this.isTracing = false;
      this.tracingCompleted.emit();
    }
  }
}
