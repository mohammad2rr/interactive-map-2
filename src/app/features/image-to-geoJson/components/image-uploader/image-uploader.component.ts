// image-uploader.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ImageTracerService } from '../../services/image-tracer.service';
import { GeoJsonStateService } from '../../services/geo-json-state.service';
import { TraceOptions } from '../../services/interfaces';
import { GeoJSON } from 'geojson';

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

  traceOptions: TraceOptions = {
    color: '#000000',
    threshold: 140,
    turdSize: 15
  };

  constructor(
    private imageTracerService: ImageTracerService,
    private geoJsonState: GeoJsonStateService
  ) {}

  ngOnInit(): void {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    this.isTracing = true;
    this.tracingStarted.emit();

    try {
      const geoJson = await this.imageTracerService.convertImageToGeoJson(
        this.selectedFile,
        this.traceOptions
      );
      
      // Log the GeoJSON data to console
      console.log('Generated GeoJSON:', geoJson);
      
      this.geoJsonGenerated.emit(geoJson);
      this.geoJsonState.updateGeoJsonData(geoJson);
    } catch (error) {
      console.error('Error processing image:', error);
      this.errorOccurred.emit(error as string);
    } finally {
      this.isTracing = false;
      this.tracingCompleted.emit();
    }
  }
}
