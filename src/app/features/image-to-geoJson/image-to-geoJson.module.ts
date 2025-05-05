// image-to-map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { GeoJsonEditorComponent } from './components/geo-json-editor/geo-json-editor.component';
import { ImageTracerService } from './services/image-tracer.service';
import { GeoJsonStorageService } from './services/geo-json-storage.service';

@NgModule({
  declarations: [ImageUploaderComponent, GeoJsonEditorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [ImageTracerService, GeoJsonStorageService],
  exports: [ImageUploaderComponent],
})
export class ImageToGeoJsonModule {}
