import { Routes } from '@angular/router';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { GeoJsonEditorComponent } from './components/geo-json-editor/geo-json-editor.component';
import { ShapeComponent } from './components/shape/shape.component';

export const imageToGeoJsonRoutes: Routes = [
  {
    path: '',
    component: ImageUploaderComponent,
    children: [
      {
        path: 'editor',
        component: GeoJsonEditorComponent
      },
      {
        path: 'preview',
        component: ShapeComponent,
        outlet: 'preview'
      }
    ]
  }
];
