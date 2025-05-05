// image-to-map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { GeoJsonEditorComponent } from './components/geo-json-editor/geo-json-editor.component';
import { ShapeComponent } from './components/shape/shape.component';
import { ImageTracerService } from './services/image-tracer.service';
import { GeoJsonStorageService } from './services/geo-json-storage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MonacoEditorModule.forRoot(),
    ImageUploaderComponent,
    GeoJsonEditorComponent,
    ShapeComponent,
  ],
  providers: [ImageTracerService, GeoJsonStorageService],
})
export class ImageToGeoJsonModule {}
