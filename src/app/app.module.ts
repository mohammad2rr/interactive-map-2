import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MapModule } from './features/map/map.module';
import { ImageToGeoJsonModule } from './features/image-to-geoJson/image-to-geoJson.module';

bootstrapApplication(AppComponent, {
  providers: [{ provide: MapModule }, ImageToGeoJsonModule],
});
