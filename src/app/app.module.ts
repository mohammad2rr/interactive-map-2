import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MapModule } from './features/map/map.module';

bootstrapApplication(AppComponent, {
  providers: [{ provide: MapModule }],
});
