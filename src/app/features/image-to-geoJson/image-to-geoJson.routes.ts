import { Routes } from '@angular/router';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { ShapeComponent } from './components/shape/shape.component';

export const imageToGeoJsonRoutes: Routes = [
  {
    path: '',
    component: ImageUploaderComponent,
    children: [
      {
        path: '',
        component: ShapeComponent,
        outlet: 'preview'
      }
    ],
  },
];
