import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageToGeoJsonModule } from './features/image-to-geoJson/image-to-geoJson.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageToGeoJsonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'interactive-map-2';
}
