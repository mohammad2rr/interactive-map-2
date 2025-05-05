import { Component, EventEmitter, Output } from '@angular/core';
import { ImageTracerService } from '../../services/image-tracer.service';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent {
  @Output() geoJsonGenerated = new EventEmitter<any>();
  selectedFile: File | null = null;
  isLoading = false;

  constructor(private imageTracer: ImageTracerService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async uploadImage(): Promise<void> {
    if (!this.selectedFile) return;

    this.isLoading = true;
    try {
      const geoJson = await this.imageTracer.convertImageToGeoJson(
        this.selectedFile
      );
      this.geoJsonGenerated.emit(geoJson);
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
