// image-to-map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { GeoJsonEditorComponent } from './components/geo-json-editor/geo-json-editor.component';
import { ShapeComponent } from './components/shape/shape.component';
import { ImageTracerService } from './services/image-tracer.service';
import { GeoJsonStorageService } from './services/geo-json-storage.service';
import { imageToGeoJsonRoutes } from './image-to-geoJson.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeoJsonEditorComponent,
    HttpClientModule,
    RouterModule.forChild(imageToGeoJsonRoutes),
    MonacoEditorModule.forRoot(),
  ],
  declarations: [],
  exports: [GeoJsonEditorComponent],
  providers: [ImageTracerService, GeoJsonStorageService],
})
export class ImageToGeoJsonModule {}
