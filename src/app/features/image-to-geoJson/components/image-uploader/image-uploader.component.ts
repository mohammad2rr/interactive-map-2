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
  template: `
    <div class="image-uploader" [class.dark-mode]="themeService.isDarkMode()">
      <div class="editor-section">
        <header class="uploader-header">
          <h2>Upload Image</h2>
          <div class="header-actions">
            <button
              class="action-button"
              [class.dark]="themeService.isDarkMode()"
            >
              <span class="material-icon">upload</span>
              Upload New
            </button>
          </div>
        </header>
        <router-outlet name="editor"></router-outlet>
      </div>
      <div class="preview-section">
        <header class="preview-header">
          <h2>Preview</h2>
          <div class="header-actions">
            <button
              class="action-button"
              [class.dark]="themeService.isDarkMode()"
            >
              <span class="material-icon">save</span>
              Save
            </button>
          </div>
        </header>
        <router-outlet name="preview"></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .image-uploader {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
        height: 100%;
        background: var(--bg-color, #ffffff);
        color: var(--text-color, #2c3e50);
        transition: all 0.3s ease;
      }

      .image-uploader.dark-mode {
        --bg-color: #1a1f2e;
        --text-color: #ecf0f1;
        --surface-color: #2c3e50;
        --border-color: rgba(255, 255, 255, 0.1);
      }

      .editor-section,
      .preview-section {
        background: var(--surface-color, #ffffff);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .uploader-header,
      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
      }

      h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-color, #2c3e50);
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .action-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #3498db;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .action-button:hover {
        background: #2980b9;
      }

      .action-button.dark {
        background: #34495e;
      }

      .action-button.dark:hover {
        background: #2c3e50;
      }

      .material-icon {
        font-size: 1.2rem;
      }

      @media (max-width: 768px) {
        .image-uploader {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
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
    threshold: 120,
    turdSize: 10,
    turnPolicy: 'minority',
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
        'Failed to process image. Please try another image.'
      );
    } finally {
      this.isTracing = false;
      this.tracingCompleted.emit();
    }
  }
}
